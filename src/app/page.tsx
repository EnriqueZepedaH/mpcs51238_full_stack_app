"use client";

import Link from "next/link";
import { useWorkouts } from "@/lib/workout-context";
import { calcVolume, formatDate, getThisWeekWorkouts } from "@/lib/utils";
import StatsCard from "@/components/stats-card";
import PageHeader from "@/components/page-header";

export default function DashboardPage() {
  const { state } = useWorkouts();
  const { workouts } = state;
  const thisWeek = getThisWeekWorkouts(workouts);
  const totalVolume = workouts.reduce(
    (sum, w) => sum + calcVolume(w.exercises),
    0
  );
  const recentWorkouts = workouts.slice(0, 3);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        subtitle="Your workout overview"
        actionLabel="Log Workout"
        actionHref="/workouts/new"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard
          label="Total Workouts"
          value={workouts.length}
          subtext="all time"
        />
        <StatsCard
          label="This Week"
          value={thisWeek.length}
          subtext={`workout${thisWeek.length !== 1 ? "s" : ""}`}
        />
        <StatsCard
          label="Total Volume"
          value={totalVolume.toLocaleString()}
          subtext="lbs lifted"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Recent Workouts
          </h2>
          <Link
            href="/workouts"
            className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            View all
          </Link>
        </div>

        {recentWorkouts.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-500">No workouts yet</p>
            <Link
              href="/workouts/new"
              className="mt-2 inline-block text-sm font-medium text-gray-900 hover:text-gray-700"
            >
              Log your first workout
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {recentWorkouts.map((workout) => (
              <Link
                key={workout.id}
                href={`/workouts/${workout.id}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div>
                  <p className="font-medium text-gray-900">{workout.title}</p>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {formatDate(workout.date)} &middot;{" "}
                    {workout.exercises.length} exercise
                    {workout.exercises.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {calcVolume(workout.exercises).toLocaleString()} lbs
                  </p>
                  <p className="text-xs text-gray-500">volume</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
