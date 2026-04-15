"use client";

import { Workout } from "@/lib/types";
import { calcVolume } from "@/lib/utils";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * Horizontal row of 7 squares representing the rolling last 7 days
 * (today on the right). Each square is colored by total volume on that day:
 * empty/light gray for rest days, deepening green for higher volume.
 * Replaces the old "Days Active 0/7" text with something visual.
 */
export default function WeekStrip({ workouts }: { workouts: Workout[] }) {
  // Build a Map<date-string, totalVolume> for the last 7 days.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i)); // oldest on left, today on right
    const dateKey = d.toISOString().split("T")[0];
    const dayWorkouts = workouts.filter((w) => w.date === dateKey);
    const volume = dayWorkouts.reduce(
      (sum, w) => sum + calcVolume(w.exercises),
      0
    );
    return {
      date: d,
      dateKey,
      volume,
      hasWorkout: dayWorkouts.length > 0,
      isToday: i === 6,
    };
  });

  const maxVolume = Math.max(...days.map((d) => d.volume), 1);

  function colorFor(volume: number, hasWorkout: boolean): string {
    if (!hasWorkout) return "bg-gray-100";
    const intensity = volume / maxVolume;
    if (intensity > 0.75) return "bg-emerald-600";
    if (intensity > 0.5) return "bg-emerald-500";
    if (intensity > 0.25) return "bg-emerald-400";
    return "bg-emerald-300";
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
        Last 7 days
      </p>
      <div className="mt-3 grid grid-cols-7 gap-2">
        {days.map((d) => {
          const dayLabel =
            DAY_LABELS[(d.date.getDay() + 6) % 7]; // Mon=0
          return (
            <div key={d.dateKey} className="flex flex-col items-center gap-1.5">
              <div
                className={`h-9 w-full rounded-md transition-colors ${colorFor(d.volume, d.hasWorkout)} ${d.isToday ? "ring-2 ring-gray-900 ring-offset-2 ring-offset-white" : ""}`}
                title={
                  d.hasWorkout
                    ? `${d.volume.toLocaleString()} lbs on ${d.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`
                    : `Rest day · ${d.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`
                }
              />
              <span className="text-xs text-gray-400">{dayLabel}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
