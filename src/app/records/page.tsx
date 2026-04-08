"use client";

import Link from "next/link";
import { useWorkouts } from "@/lib/workout-context";
import {
  getPersonalRecords,
  getWeeklySummaries,
  formatDate,
} from "@/lib/utils";
import PageHeader from "@/components/page-header";

export default function RecordsPage() {
  const { state } = useWorkouts();
  const records = getPersonalRecords(state.workouts);
  const weeklySummaries = getWeeklySummaries(state.workouts);
  const maxVolume = Math.max(...weeklySummaries.map((w) => w.totalVolume), 1);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Personal Records"
        subtitle="Your best lifts and weekly progress"
      />

      <div>
        <h2 className="text-lg font-medium text-gray-900">Best Lifts</h2>
        {records.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-500">No records yet</p>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Exercise
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Best Weight
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Reps
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map((record) => (
                  <tr key={record.exerciseName} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/workouts/${record.workoutId}`}
                        className="font-medium text-gray-900 hover:text-gray-600"
                      >
                        {record.exerciseName}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-semibold text-emerald-600">
                        {record.maxWeight} lbs
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm text-gray-500">
                      {record.reps} reps
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm text-gray-500">
                      {formatDate(record.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900">Weekly Volume</h2>
        {weeklySummaries.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-500">No data yet</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {weeklySummaries.map((week) => (
              <div
                key={week.weekLabel}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {week.weekLabel}
                    </p>
                    <p className="text-xs text-gray-500">
                      {week.workoutCount} workout
                      {week.workoutCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {week.totalVolume.toLocaleString()} lbs
                  </p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gray-900 transition-all duration-300"
                    style={{
                      width: `${(week.totalVolume / maxVolume) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {week.exerciseNames.map((name) => (
                    <span
                      key={name}
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
