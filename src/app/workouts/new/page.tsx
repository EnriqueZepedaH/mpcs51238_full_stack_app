"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useWorkouts } from "@/lib/workout-context";
import { Exercise, Routine, Workout } from "@/lib/types";
import { getRecentPRWeight, roundToNearestFive } from "@/lib/utils";
import ExerciseForm from "@/components/exercise-form";
import PageHeader from "@/components/page-header";

function emptyExercise(): Exercise {
  return {
    id: crypto.randomUUID(),
    name: "",
    notes: "",
    sets: [{ id: crypto.randomUUID(), reps: 0, weight: 0 }],
  };
}

/**
 * Builds workout exercises from a routine template. If the user has logged
 * the same exercise within the last 30 days, suggest weights based on their
 * recent PR: 80% on the first set (top working set), 75% on subsequent sets.
 * Falls back to 0 lbs when there's no recent history to anchor on.
 */
function routineToExercises(routine: Routine, workouts: Workout[]): Exercise[] {
  return routine.exercises.map((re) => {
    const recentPR = getRecentPRWeight(workouts, re.name, 30);
    return {
      id: crypto.randomUUID(),
      name: re.name,
      notes: "",
      muscleGroup: re.muscleGroup,
      libraryExerciseId: re.libraryExerciseId,
      sets: Array.from({ length: re.targetSets }, (_, i) => ({
        id: crypto.randomUUID(),
        reps: re.targetReps,
        weight: recentPR
          ? roundToNearestFive(recentPR * (i === 0 ? 0.8 : 0.75))
          : 0,
      })),
    };
  });
}

function NewWorkoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routineIdParam = searchParams.get("routine");
  const { state, dispatch } = useWorkouts();

  const initialRoutine = routineIdParam
    ? state.routines.find((r) => r.id === routineIdParam)
    : null;

  const [selectedRoutineId, setSelectedRoutineId] = useState(
    initialRoutine?.id ?? ""
  );
  const [title, setTitle] = useState(initialRoutine?.name ?? "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [exercises, setExercises] = useState<Exercise[]>(
    initialRoutine
      ? routineToExercises(initialRoutine, state.workouts)
      : [emptyExercise()]
  );

  const selectedRoutine = state.routines.find(
    (r) => r.id === selectedRoutineId
  );

  function handleRoutineChange(newId: string) {
    setSelectedRoutineId(newId);
    if (!newId) {
      // Switched back to "Start from scratch"
      setTitle("");
      setExercises([emptyExercise()]);
      return;
    }
    const routine = state.routines.find((r) => r.id === newId);
    if (routine) {
      setTitle(routine.name);
      setExercises(routineToExercises(routine, state.workouts));
    }
  }

  function addExercise() {
    setExercises([...exercises, emptyExercise()]);
  }

  function updateExercise(index: number, updated: Exercise) {
    const newExercises = [...exercises];
    newExercises[index] = updated;
    setExercises(newExercises);
  }

  function removeExercise(index: number) {
    if (exercises.length <= 1) return;
    setExercises(exercises.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const workout: Workout = {
      id: crypto.randomUUID(),
      title: title || "Untitled Workout",
      date,
      exercises: exercises.filter((ex) => ex.name.trim() !== ""),
      createdAt: new Date().toISOString(),
    };

    await dispatch({ type: "ADD_WORKOUT", payload: workout });
    router.push(`/workouts/${workout.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Log Workout"
        subtitle={
          selectedRoutine
            ? `From routine: ${selectedRoutine.name}`
            : "Record your exercises and sets"
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="routine-select"
            className="block text-sm font-medium text-gray-700"
          >
            Start from routine{" "}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          {state.routines.length === 0 ? (
            <p className="mt-1 text-sm text-gray-500">
              No routines yet.{" "}
              <Link
                href="/routines/new"
                className="font-medium text-gray-900 hover:underline"
              >
                Create one
              </Link>{" "}
              to reuse it later.
            </p>
          ) : (
            <select
              id="routine-select"
              value={selectedRoutineId}
              onChange={(e) => handleRoutineChange(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">— Start from scratch —</option>
              {state.routines.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.exercises.length} exercise
                  {r.exercises.length !== 1 ? "s" : ""})
                </option>
              ))}
            </select>
          )}
          {selectedRoutine && (
            <p className="mt-1 text-xs text-gray-500">
              Sets and reps from the routine. Weights estimated at 80% / 75%
              of your last-30-day PR per exercise — adjust as needed.
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Workout Title
            </label>
            <input
              type="text"
              placeholder="e.g. Upper Body Push"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900">Exercises</h2>
          <div className="mt-3 space-y-4">
            {exercises.map((exercise, index) => (
              <ExerciseForm
                key={exercise.id}
                exercise={exercise}
                index={index}
                workouts={state.workouts}
                onChange={(updated) => updateExercise(index, updated)}
                onRemove={() => removeExercise(index)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={addExercise}
            className="mt-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            + Add Exercise
          </button>
        </div>

        <div className="flex items-center gap-3 border-t border-gray-200 pt-6">
          <button
            type="submit"
            className="rounded-md bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Save Workout
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewWorkoutPage() {
  return (
    <Suspense>
      <NewWorkoutForm />
    </Suspense>
  );
}
