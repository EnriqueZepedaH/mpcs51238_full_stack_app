"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useWorkouts } from "@/lib/workout-context";
import {
  calcVolume,
  formatDate,
  getWeeklySummaries,
  getWeekStreak,
  getRecentPRs,
  getLast7DaysWorkouts,
} from "@/lib/utils";
import PageHeader from "@/components/page-header";
import MuscleHeatmap from "@/components/muscle-heatmap";
import LandingPage from "@/components/landing-page";
import WeekStrip from "@/components/week-strip";
import WeekVolumeCard from "@/components/week-volume-card";
import StreakCard from "@/components/streak-card";
import MuscleGroupBadge from "@/components/muscle-group-badge";

export default function HomePage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { state } = useWorkouts();

  if (!isLoaded || (isSignedIn && state.loading)) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <LandingPage />;
  }

  const { workouts } = state;
  const isEmpty = workouts.length === 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        actionLabel="Log Workout"
        actionHref="/workouts/new"
      />

      <WeekStrip workouts={workouts} />

      {isEmpty ? <EmptyDashboard /> : <PopulatedDashboard workouts={workouts} />}
    </div>
  );
}

function EmptyDashboard() {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
      <p className="text-base font-medium text-gray-900">
        Log your first workout to see your stats
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Streaks, volume trends, and personal records will appear here.
      </p>
      <Link
        href="/workouts/new"
        className="mt-4 inline-flex rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
      >
        Log Workout
      </Link>
    </div>
  );
}

function PopulatedDashboard({ workouts }: { workouts: import("@/lib/types").Workout[] }) {
  const weeklySummaries = getWeeklySummaries(workouts);
  const streak = getWeekStreak(workouts);
  const last7Days = getLast7DaysWorkouts(workouts);
  const recentPRs = getRecentPRs(workouts, 3);
  const recentWorkouts = workouts.slice(0, 3);

  // "NEW" badge on PRs set within the last 7 days.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <WeekVolumeCard weeklySummaries={weeklySummaries} />
        <StreakCard current={streak.current} longest={streak.longest} />
      </div>

      <MuscleHeatmap exercises={last7Days.flatMap((w) => w.exercises)} />

      {recentPRs.length > 0 && (
        <section>
          <h2 className="text-lg font-medium text-gray-900">Recent PRs</h2>
          <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <ul className="divide-y divide-gray-100">
              {recentPRs.map((pr) => {
                const prDate = new Date(pr.date + "T00:00:00");
                const isFresh = prDate >= sevenDaysAgo;
                return (
                  <li
                    key={`${pr.exerciseName}-${pr.workoutId}`}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/workouts/${pr.workoutId}`}
                        className="font-medium text-gray-900 hover:text-gray-600"
                      >
                        {pr.exerciseName}
                      </Link>
                      {pr.muscleGroup && (
                        <MuscleGroupBadge muscleGroup={pr.muscleGroup} />
                      )}
                      {isFresh && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          NEW
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-600">
                        {pr.maxWeight} lbs · {pr.reps} reps
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(pr.date)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Workouts</h2>
          <Link
            href="/workouts"
            className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-700"
          >
            View all
          </Link>
        </div>

        <div className="mt-3 space-y-3">
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
      </section>
    </>
  );
}
