"use client";

import { useState } from "react";
import Link from "next/link";
import { MID_LEVEL_GROUPS, getMuscleGroupsIn } from "@/lib/exercise-library";
import { useWorkouts } from "@/lib/workout-context";
import {
  getPersonalRecords,
  getWeeklySummaries,
  formatDate,
} from "@/lib/utils";
import PageHeader from "@/components/page-header";
import MuscleGroupBadge from "@/components/muscle-group-badge";

export default function RecordsPage() {
  const { state } = useWorkouts();
  const [muscleFilter, setMuscleFilter] = useState<string | undefined>();
  const [nameFilter, setNameFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  if (state.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  const allRecords = getPersonalRecords(state.workouts);
  const weeklySummaries = getWeeklySummaries(state.workouts);
  const maxVolume = Math.max(...weeklySummaries.map((w) => w.totalVolume), 1);

  const records = allRecords.filter((r) => {
    if (muscleFilter) {
      const leafGroups = getMuscleGroupsIn(muscleFilter);
      if (!r.muscleGroup || !leafGroups.includes(r.muscleGroup)) return false;
    }
    if (nameFilter && !r.exerciseName.toLowerCase().includes(nameFilter.toLowerCase())) return false;
    if (dateFrom && r.date < dateFrom) return false;
    if (dateTo && r.date > dateTo) return false;
    return true;
  });

  const hasFilters = muscleFilter || nameFilter || dateFrom || dateTo;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Personal Records"
        subtitle="Your best lifts and weekly progress"
      />

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMuscleFilter(undefined)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              !muscleFilter
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
                setMuscleFilter(muscleFilter === group ? undefined : group)
              }
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                muscleFilter === group
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {group}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search exercise..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="w-48 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>From</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <span>to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          {hasFilters && (
            <button
              onClick={() => {
                setMuscleFilter(undefined);
                setNameFilter("");
                setDateFrom("");
                setDateTo("");
              }}
              className="text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900">
          Best Lifts
          {hasFilters && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({records.length} of {allRecords.length})
            </span>
          )}
        </h2>
        {records.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-500">
              {hasFilters ? "No records match your filters" : "No records yet"}
            </p>
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
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/workouts/${record.workoutId}`}
                          className="font-medium text-gray-900 hover:text-gray-600"
                        >
                          {record.exerciseName}
                        </Link>
                        {record.muscleGroup && (
                          <MuscleGroupBadge muscleGroup={record.muscleGroup} />
                        )}
                      </div>
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
