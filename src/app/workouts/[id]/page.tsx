"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWorkouts } from "@/lib/workout-context";
import { calcVolume, formatDateLong } from "@/lib/utils";
import ExerciseDetail from "@/components/exercise-detail";
import MuscleHeatmap from "@/components/muscle-heatmap";

export default function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { state, dispatch } = useWorkouts();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const workout = state.workouts.find((w) => w.id === id);

  if (!workout) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-gray-900">Workout not found</p>
        <p className="mt-1 text-sm text-gray-500">
          This workout may have been deleted
        </p>
        <Link
          href="/workouts"
          className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Back to Workouts
        </Link>
      </div>
    );
  }

  const volume = calcVolume(workout.exercises);
  const totalSets = workout.exercises.reduce(
    (sum, e) => sum + e.sets.length,
    0
  );

  function handleDelete() {
    dispatch({ type: "DELETE_WORKOUT", payload: { id: workout!.id } });
    router.push("/workouts");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/workouts"
          className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
        >
          &larr; Back to Workouts
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {workout.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {formatDateLong(workout.date)}
          </p>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            Delete this workout?
          </p>
          <p className="mt-1 text-sm text-red-600">
            This action cannot be undone.
          </p>
          <div className="mt-3 flex gap-3">
            <button
              onClick={handleDelete}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-gray-900">
            {workout.exercises.length}
          </p>
          <p className="text-xs text-gray-500">exercises</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-gray-900">{totalSets}</p>
          <p className="text-xs text-gray-500">total sets</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <p className="text-2xl font-semibold text-gray-900">
            {volume.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">lbs volume</p>
        </div>
      </div>

      <MuscleHeatmap exercises={workout.exercises} />

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Exercises</h2>
        {workout.exercises.map((exercise, index) => (
          <ExerciseDetail
            key={exercise.id}
            exercise={exercise}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
