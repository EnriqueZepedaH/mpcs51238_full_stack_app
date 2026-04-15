"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import { useWorkouts } from "@/lib/workout-context";

export default function SavedPage() {
  const { state, dispatch } = useWorkouts();
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  const exercises = state.savedExercises;

  async function handleUnsave(exerciseId: number) {
    if (removingIds.has(exerciseId)) return;
    setRemovingIds((prev) => new Set(prev).add(exerciseId));

    try {
      await dispatch({
        type: "REMOVE_SAVED_EXERCISE",
        payload: { apiExerciseId: exerciseId },
      });
    } catch (err) {
      console.error(err);
      setError("Failed to unsave exercise.");
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(exerciseId);
        return next;
      });
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved Exercises"
        subtitle={`${exercises.length} exercise${exercises.length !== 1 ? "s" : ""} saved from the wger database`}
        actionLabel="Explore More"
        actionHref="/explore"
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {exercises.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-sm text-gray-500">No saved exercises yet</p>
          <Link
            href="/explore"
            className="mt-2 inline-block text-sm font-medium text-gray-900 hover:text-gray-700"
          >
            Browse the exercise library
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <div className="relative h-40 w-full bg-gray-100">
                {ex.imageUrl ? (
                  <Image
                    src={ex.imageUrl}
                    alt={ex.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <svg
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 7.5h-.75a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 001.5 1.5h.75m10.5-9h.75a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5h-.75M3 9v6m18-6v6M6.75 7.5v9m10.5-9v9M6.75 12h10.5"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <div>
                  <p className="font-medium text-gray-900">{ex.name}</p>
                  {ex.muscleGroup && (
                    <p className="mt-0.5 text-xs text-gray-500">
                      {ex.muscleGroup}
                    </p>
                  )}
                </div>
                {ex.description && (
                  <div
                    className="line-clamp-3 text-sm text-gray-600"
                    dangerouslySetInnerHTML={{ __html: ex.description }}
                  />
                )}
                {ex.equipment.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {ex.equipment.map((eq) => (
                      <span
                        key={eq.id}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                      >
                        {eq.name}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-auto pt-2">
                  <button
                    onClick={() => handleUnsave(ex.apiExerciseId)}
                    disabled={removingIds.has(ex.apiExerciseId)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-red-50 hover:border-red-300 hover:text-red-700 disabled:opacity-50"
                  >
                    {removingIds.has(ex.apiExerciseId) ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
