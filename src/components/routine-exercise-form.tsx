"use client";

import { MuscleGroup, RoutineExercise } from "@/lib/types";
import { useWorkouts } from "@/lib/workout-context";
import ExerciseCombobox from "./exercise-combobox";
import MuscleGroupBadge from "./muscle-group-badge";

export default function RoutineExerciseForm({
  exercise,
  index,
  onChange,
  onRemove,
}: {
  exercise: RoutineExercise;
  index: number;
  onChange: (updated: RoutineExercise) => void;
  onRemove: () => void;
}) {
  const { state } = useWorkouts();
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
        {index + 1}
      </span>

      <div className="min-w-0 flex-1">
        <ExerciseCombobox
          value={exercise.name}
          onChange={(name: string, muscleGroup?: MuscleGroup, libraryExerciseId?: string) =>
            onChange({ ...exercise, name, muscleGroup, libraryExerciseId })
          }
          placeholder="Search exercises..."
          savedExercises={state.savedExercises}
        />
      </div>

      {exercise.muscleGroup && (
        <MuscleGroupBadge muscleGroup={exercise.muscleGroup} />
      )}

      <div className="flex shrink-0 items-center gap-2">
        <div className="w-16">
          <input
            type="number"
            min={1}
            placeholder="Sets"
            value={exercise.targetSets || ""}
            onChange={(e) =>
              onChange({
                ...exercise,
                targetSets: parseInt(e.target.value) || 0,
              })
            }
            className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-center text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <p className="mt-0.5 text-center text-xs text-gray-400">sets</p>
        </div>
        <div className="w-16">
          <input
            type="number"
            min={1}
            placeholder="Reps"
            value={exercise.targetReps || ""}
            onChange={(e) =>
              onChange({
                ...exercise,
                targetReps: parseInt(e.target.value) || 0,
              })
            }
            className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-center text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <p className="mt-0.5 text-center text-xs text-gray-400">reps</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
