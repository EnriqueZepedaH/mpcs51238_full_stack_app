import Link from "next/link";
import { Workout } from "@/lib/types";
import { calcVolume, formatDate } from "@/lib/utils";

export default function WorkoutCard({ workout }: { workout: Workout }) {
  const volume = calcVolume(workout.exercises);
  const exerciseNames = workout.exercises.map((e) => e.name).join(", ");

  return (
    <Link
      href={`/workouts/${workout.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{workout.title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {formatDate(workout.date)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {volume.toLocaleString()} lbs
          </p>
          <p className="text-xs text-gray-500">volume</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span>
          {workout.exercises.length} exercise
          {workout.exercises.length !== 1 ? "s" : ""}
        </span>
        <span>
          {workout.exercises.reduce((sum, e) => sum + e.sets.length, 0)} sets
        </span>
      </div>
      <p className="mt-2 truncate text-sm text-gray-400">{exerciseNames}</p>
    </Link>
  );
}
