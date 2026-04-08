"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkouts } from "@/lib/workout-context";
import { Routine, RoutineExercise } from "@/lib/types";
import RoutineExerciseForm from "@/components/routine-exercise-form";
import PageHeader from "@/components/page-header";

export default function NewRoutinePage() {
  const router = useRouter();
  const { dispatch } = useWorkouts();

  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<RoutineExercise[]>([
    {
      id: crypto.randomUUID(),
      name: "",
      targetSets: 3,
      targetReps: 10,
    },
  ]);

  function addExercise() {
    setExercises([
      ...exercises,
      {
        id: crypto.randomUUID(),
        name: "",
        targetSets: 3,
        targetReps: 10,
      },
    ]);
  }

  function updateExercise(index: number, updated: RoutineExercise) {
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

    const routine: Routine = {
      id: crypto.randomUUID(),
      name: name || "Untitled Routine",
      exercises: exercises.filter((ex) => ex.name.trim() !== ""),
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: "ADD_ROUTINE", payload: routine });
    router.push(`/routines/${routine.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Create Routine"
        subtitle="Define a reusable workout template"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Routine Name
          </label>
          <input
            type="text"
            placeholder="e.g. Push Day"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900">Exercises</h2>
          <div className="mt-3 space-y-3">
            {exercises.map((exercise, index) => (
              <RoutineExerciseForm
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
            Save Routine
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
