"use client";

import { useWorkouts } from "@/lib/workout-context";
import PageHeader from "@/components/page-header";
import WorkoutCard from "@/components/workout-card";
import Link from "next/link";

export default function WorkoutsPage() {
  const { state } = useWorkouts();
  const workouts = [...state.workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workouts"
        subtitle={`${workouts.length} workout${workouts.length !== 1 ? "s" : ""} logged`}
        actionLabel="Log Workout"
        actionHref="/workouts/new"
      />

      {workouts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-sm text-gray-500">No workouts yet</p>
          <Link
            href="/workouts/new"
            className="mt-2 inline-block text-sm font-medium text-gray-900 hover:text-gray-700"
          >
            Log your first workout
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </div>
  );
}
