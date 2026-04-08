"use client";

import { Exercise, MuscleGroup, Workout, WorkoutSet } from "@/lib/types";
import { getPRWeight } from "@/lib/utils";
import SetInputRow from "./set-input-row";
import ExerciseCombobox from "./exercise-combobox";
import MuscleGroupBadge from "./muscle-group-badge";

export default function ExerciseForm({
  exercise,
  index,
  onChange,
  onRemove,
  workouts,
}: {
  exercise: Exercise;
  index: number;
  onChange: (updated: Exercise) => void;
  onRemove: () => void;
  workouts?: Workout[];
}) {
  const prWeight = workouts && exercise.name
    ? getPRWeight(workouts, exercise.name)
    : undefined;
  const suggestedWeight = prWeight ? Math.round(prWeight * 0.75) : undefined;

  function addSet() {
    const newSet: WorkoutSet = {
      id: crypto.randomUUID(),
      reps: 0,
      weight: suggestedWeight || 0,
    };
    onChange({ ...exercise, sets: [...exercise.sets, newSet] });
  }

  function updateSet(setIndex: number, updated: WorkoutSet) {
    const newSets = [...exercise.sets];
    newSets[setIndex] = updated;
    onChange({ ...exercise, sets: newSets });
  }

  function removeSet(setIndex: number) {
    onChange({
      ...exercise,
      sets: exercise.sets.filter((_, i) => i !== setIndex),
    });
  }

  function handleExerciseSelect(
    name: string,
    muscleGroup?: MuscleGroup,
    libraryExerciseId?: string
  ) {
    const pr = workouts && name ? getPRWeight(workouts, name) : undefined;
    const suggested = pr ? Math.round(pr * 0.75) : undefined;

    const updatedSets = suggested
      ? exercise.sets.map((set) =>
          set.weight === 0 ? { ...set, weight: suggested } : set
        )
      : exercise.sets;

    onChange({
      ...exercise,
      name,
      muscleGroup,
      libraryExerciseId,
      sets: updatedSets,
    });
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
              {index + 1}
            </span>
            <div className="flex-1">
              <ExerciseCombobox
                value={exercise.name}
                onChange={handleExerciseSelect}
                placeholder="Search exercises..."
              />
            </div>
            {exercise.muscleGroup && (
              <MuscleGroupBadge muscleGroup={exercise.muscleGroup} />
            )}
          </div>
          {prWeight !== undefined && prWeight > 0 && (
            <p className="text-xs text-gray-400">
              PR: {prWeight} lbs &middot; Suggested: {suggestedWeight} lbs (75%)
            </p>
          )}
          <input
            type="text"
            placeholder="Notes (optional)"
            value={exercise.notes}
            onChange={(e) =>
              onChange({ ...exercise, notes: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="ml-3 rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {exercise.sets.length > 0 && (
          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-gray-400">
            <span className="w-8 text-center">Set</span>
            <span className="flex-1">Reps</span>
            <span className="flex-1">Weight (lbs)</span>
            <span className="w-10" />
          </div>
        )}
        {exercise.sets.map((set, setIndex) => (
          <SetInputRow
            key={set.id}
            set={set}
            index={setIndex}
            onChange={(updated) => updateSet(setIndex, updated)}
            onRemove={() => removeSet(setIndex)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={addSet}
        className="mt-3 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
      >
        + Add Set
      </button>
    </div>
  );
}
