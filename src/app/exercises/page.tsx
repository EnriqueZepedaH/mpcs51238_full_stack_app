"use client";

import { useState } from "react";
import { MID_LEVEL_GROUPS, searchExercises } from "@/lib/exercise-library";
import PageHeader from "@/components/page-header";
import MuscleGroupBadge from "@/components/muscle-group-badge";

export default function ExercisesPage() {
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(
    undefined
  );
  const [query, setQuery] = useState("");

  const exercises = searchExercises(query, selectedGroup);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exercise Library"
        subtitle={`${exercises.length} exercises`}
      />

      <input
        type="text"
        placeholder="Search exercises..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedGroup(undefined)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !selectedGroup
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {MID_LEVEL_GROUPS.map((group) => (
          <button
            key={group}
            onClick={() =>
              setSelectedGroup(selectedGroup === group ? undefined : group)
            }
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedGroup === group
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      {exercises.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
          <p className="text-sm text-gray-500">No exercises found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
            >
              <span className="text-sm font-medium text-gray-900">
                {exercise.name}
              </span>
              <MuscleGroupBadge muscleGroup={exercise.muscleGroup} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
