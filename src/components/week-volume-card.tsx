"use client";

import { WeeklySummary } from "@/lib/utils";

/**
 * Stat card showing this week's total volume with a 4-week trend bar chart
 * and a week-over-week delta indicator.
 *
 * `weeklySummaries` is the output of getWeeklySummaries(workouts) — sorted
 * descending (newest first). We use the first 4 entries.
 */
export default function WeekVolumeCard({
  weeklySummaries,
}: {
  weeklySummaries: WeeklySummary[];
}) {
  const recent = weeklySummaries.slice(0, 4); // newest first
  const thisWeek = recent[0];
  const lastWeek = recent[1];
  const maxVolume = Math.max(...recent.map((w) => w.totalVolume), 1);

  const thisWeekVolume = thisWeek?.totalVolume ?? 0;
  const lastWeekVolume = lastWeek?.totalVolume ?? 0;

  let deltaText = "First week";
  let deltaColor = "text-gray-500";
  if (lastWeek && lastWeekVolume > 0) {
    const pct = ((thisWeekVolume - lastWeekVolume) / lastWeekVolume) * 100;
    const sign = pct >= 0 ? "+" : "";
    deltaText = `${sign}${pct.toFixed(0)}% vs last week`;
    deltaColor = pct >= 0 ? "text-emerald-600" : "text-gray-500";
  } else if (thisWeekVolume > 0 && !lastWeek) {
    deltaText = "First week";
  } else if (thisWeekVolume === 0) {
    deltaText = "No volume yet this week";
  }

  // Render bars oldest-to-newest (left to right), so reverse the slice.
  const bars = [...recent].reverse();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
        This week
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-3xl font-semibold text-gray-900">
          {thisWeekVolume.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">lbs</p>
      </div>
      <p className={`mt-1 text-xs font-medium ${deltaColor}`}>{deltaText}</p>

      <div className="mt-4 flex h-12 items-end gap-1.5">
        {bars.length === 0 ? (
          <div className="flex h-full w-full items-end gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-2 flex-1 rounded-sm bg-gray-100"
              />
            ))}
          </div>
        ) : (
          // Pad the left with empty bars if we have <4 weeks of history.
          <>
            {Array.from({ length: 4 - bars.length }).map((_, i) => (
              <div
                key={`pad-${i}`}
                className="h-2 flex-1 rounded-sm bg-gray-100"
              />
            ))}
            {bars.map((week, i) => {
              const isCurrent = i === bars.length - 1;
              const heightPct = Math.max(
                (week.totalVolume / maxVolume) * 100,
                4
              );
              return (
                <div
                  key={week.weekLabel}
                  className={`flex-1 rounded-sm transition-colors ${isCurrent ? "bg-gray-900" : "bg-gray-200"}`}
                  style={{ height: `${heightPct}%` }}
                  title={`${week.weekLabel}: ${week.totalVolume.toLocaleString()} lbs`}
                />
              );
            })}
          </>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-400">Last 4 weeks</p>
    </div>
  );
}
