"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWorkouts } from "@/lib/workout-context";
import { Exercise, Workout } from "@/lib/types";
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

function NewWorkoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routineId = searchParams.get("routine");
  const { state, dispatch } = useWorkouts();

  const routine = routineId
    ? state.routines.find((r) => r.id === routineId)
    : null;

  const [title, setTitle] = useState(routine?.name || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [exercises, setExercises] = useState<Exercise[]>(
    routine
      ? routine.exercises.map((re) => ({
          id: crypto.randomUUID(),
          name: re.name,
          notes: "",
          muscleGroup: re.muscleGroup,
          libraryExerciseId: re.libraryExerciseId,
          sets: Array.from({ length: re.targetSets }, () => ({
            id: crypto.randomUUID(),
            reps: re.targetReps,
            weight: 0,
          })),
        }))
      : [emptyExercise()]
  );

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const workout: Workout = {
      id: crypto.randomUUID(),
      title: title || "Untitled Workout",
      date,
      exercises: exercises.filter((ex) => ex.name.trim() !== ""),
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: "ADD_WORKOUT", payload: workout });
    router.push(`/workouts/${workout.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Log Workout"
        subtitle={
          routine
            ? `From routine: ${routine.name}`
            : "Record your exercises and sets"
        }
      />

      {routine && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          Pre-filled from <span className="font-medium text-gray-900">{routine.name}</span> routine. Fill in your weights and adjust as needed.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
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
