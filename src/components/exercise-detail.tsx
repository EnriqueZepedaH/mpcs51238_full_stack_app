import { Exercise } from "@/lib/types";
import MuscleGroupBadge from "./muscle-group-badge";

export default function ExerciseDetail({
  exercise,
  index,
}: {
  exercise: Exercise;
  index: number;
}) {
  const totalVolume = exercise.sets.reduce(
    (sum, set) => sum + set.weight * set.reps,
    0
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
            {index + 1}
          </span>
          <h3 className="font-medium text-gray-900">{exercise.name}</h3>
          {exercise.muscleGroup && (
            <MuscleGroupBadge muscleGroup={exercise.muscleGroup} />
          )}
        </div>
        <span className="text-sm text-gray-500">
          {totalVolume.toLocaleString()} lbs
        </span>
      </div>

      {exercise.notes && (
        <p className="mt-2 text-sm text-gray-500">{exercise.notes}</p>
      )}

      <div className="mt-4">
        <div className="flex gap-3 text-xs font-medium uppercase tracking-wider text-gray-400">
          <span className="w-12 text-center">Set</span>
          <span className="w-20 text-center">Reps</span>
          <span className="w-24 text-center">Weight</span>
          <span className="flex-1 text-right">Volume</span>
        </div>
        <div className="mt-2 space-y-1.5">
          {exercise.sets.map((set, setIndex) => (
            <div
              key={set.id}
              className="flex items-center gap-3 rounded-md py-1.5 text-sm"
            >
              <span className="w-12 text-center text-gray-400">
                {setIndex + 1}
              </span>
              <span className="w-20 text-center text-gray-900">
                {set.reps}
              </span>
              <span className="w-24 text-center text-gray-900">
                {set.weight} lbs
              </span>
              <span className="flex-1 text-right text-gray-500">
                {(set.weight * set.reps).toLocaleString()} lbs
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
