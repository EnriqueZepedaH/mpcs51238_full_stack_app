"use client";

import { useState } from "react";
import { useWorkouts } from "@/lib/workout-context";
import PageHeader from "@/components/page-header";
import WorkoutCard from "@/components/workout-card";
import WorkoutCalendar from "@/components/workout-calendar";
import Link from "next/link";

const PAGE_SIZE = 10;

export default function WorkoutsPage() {
  const { state } = useWorkouts();
  const workouts = [...state.workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleWorkouts = workouts.slice(0, visibleCount);
  const hasMore = visibleCount < workouts.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workouts"
        subtitle={`${workouts.length} workout${workouts.length !== 1 ? "s" : ""} logged`}
        actionLabel="Log Workout"
        actionHref="/workouts/new"
      />

      <WorkoutCalendar workouts={workouts} />

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
        <div>
          <h2 className="mb-3 text-lg font-medium text-gray-900">
            Recent Workouts
          </h2>
          <div className="space-y-3">
            {visibleWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
          {hasMore && (
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="mt-4 w-full rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Load more ({workouts.length - visibleCount} remaining)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
