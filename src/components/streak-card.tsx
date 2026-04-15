"use client";

/**
 * Stat card showing the user's current rolling-7-day-window workout streak,
 * with their longest-ever streak as context. When the current streak ties
 * the all-time longest, we celebrate it with a "Personal best" callout.
 */
export default function StreakCard({
  current,
  longest,
}: {
  current: number;
  longest: number;
}) {
  const isPB = current > 1 && current === longest;

  let subtext: string;
  let subtextColor = "text-gray-500";
  if (current === 0) {
    subtext = longest > 0 ? `Longest: ${longest} weeks` : "Start your first week";
  } else if (isPB) {
    subtext = "Personal best";
    subtextColor = "text-emerald-600";
  } else {
    subtext = `Longest: ${longest} weeks`;
  }

  const unit = current === 1 ? "week" : "weeks";

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
        Streak
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-3xl font-semibold text-gray-900">{current}</p>
        <p className="text-sm text-gray-500">{unit}</p>
      </div>
      <p className={`mt-1 text-xs font-medium ${subtextColor}`}>{subtext}</p>

      <div className="mt-4">
        <p className="text-xs text-gray-400">
          A streak stays alive while you log a workout in any rolling 7-day window.
        </p>
      </div>
    </div>
  );
}
