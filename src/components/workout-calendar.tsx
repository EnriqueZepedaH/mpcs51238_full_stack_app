"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Workout } from "@/lib/types";
import { calcVolume } from "@/lib/utils";

type ViewMode = "month" | "week";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const INACTIVE = "#F3F4F6";
const SCALE = ["#BBF7D0", "#86EFAC", "#4ADE80", "#22C55E", "#16A34A"];

function dateKey(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getColor(volume: number, maxVolume: number): string {
  if (!volume || !maxVolume) return INACTIVE;
  const ratio = volume / maxVolume;
  const idx = Math.min(Math.floor(ratio * SCALE.length), SCALE.length - 1);
  return SCALE[idx];
}

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default function WorkoutCalendar({
  workouts,
}: {
  workouts: Workout[];
}) {
  const today = new Date();
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [weekStart, setWeekStart] = useState(getMonday(today));
  const [tooltip, setTooltip] = useState<{
    workouts: Workout[];
    x: number;
    y: number;
  } | null>(null);

  const workoutsByDate = useMemo(() => {
    const map = new Map<string, Workout[]>();
    for (const w of workouts) {
      const existing = map.get(w.date) || [];
      existing.push(w);
      map.set(w.date, existing);
    }
    return map;
  }, [workouts]);

  const maxVolume = useMemo(() => {
    let max = 0;
    for (const ws of workoutsByDate.values()) {
      const vol = ws.reduce((s, w) => s + calcVolume(w.exercises), 0);
      if (vol > max) max = vol;
    }
    return max || 1;
  }, [workoutsByDate]);

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  }

  function prevWeek() {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  }

  function nextWeek() {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  }

  function handleDayHover(e: React.MouseEvent, dayWorkouts: Workout[]) {
    if (dayWorkouts.length === 0) return;
    const rect = (e.currentTarget as HTMLElement)
      .closest(".calendar-container")!
      .getBoundingClientRect();
    setTooltip({
      workouts: dayWorkouts,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 8,
    });
  }

  function getMonthDays(): Date[] {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const day = firstDay.getDay();
    const startOffset = day === 0 ? -6 : 1 - day;
    const start = new Date(firstDay);
    start.setDate(start.getDate() + startOffset);

    const days: Date[] = [];
    const d = new Date(start);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return days;
  }

  function getWeekDays(): Date[] {
    const days: Date[] = [];
    const d = new Date(weekStart);
    for (let i = 0; i < 7; i++) {
      days.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return days;
  }

  function renderDayCell(date: Date, large: boolean) {
    const key = dateKey(date);
    const dayWorkouts = workoutsByDate.get(key) || [];
    const vol = dayWorkouts.reduce(
      (s, w) => s + calcVolume(w.exercises),
      0
    );
    const isToday = key === dateKey(today);
    const isCurrentMonth = date.getMonth() === currentMonth;
    const bg = dayWorkouts.length > 0 ? getColor(vol, maxVolume) : INACTIVE;

    return (
      <div
        key={key}
        className={`relative cursor-default rounded-md transition-shadow ${
          large ? "p-2" : "p-1"
        } ${isToday ? "ring-2 ring-gray-900" : ""} ${
          !isCurrentMonth && viewMode === "month" ? "opacity-30" : ""
        }`}
        style={{ backgroundColor: bg }}
        onMouseMove={(e) => handleDayHover(e, dayWorkouts)}
        onMouseLeave={() => setTooltip(null)}
      >
        <span
          className={`text-xs ${
            dayWorkouts.length > 0
              ? "font-medium text-gray-800"
              : "text-gray-400"
          }`}
        >
          {date.getDate()}
        </span>
        {large && dayWorkouts.length > 0 && (
          <div className="mt-1">
            {dayWorkouts.map((w) => (
              <Link
                key={w.id}
                href={`/workouts/${w.id}`}
                className="block truncate text-xs font-medium text-gray-700 hover:text-gray-900"
              >
                {w.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="calendar-container relative rounded-lg border border-gray-200 bg-white p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={viewMode === "month" ? prevMonth : prevWeek}
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <h3 className="min-w-[160px] text-center text-sm font-medium text-gray-900">
            {viewMode === "month"
              ? `${MONTH_NAMES[currentMonth]} ${currentYear}`
              : `${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(weekStart.getTime() + 6 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
          </h3>
          <button
            onClick={viewMode === "month" ? nextMonth : nextWeek}
            className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
        <div className="flex gap-1">
          {(["week", "month"] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                viewMode === mode
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Day labels */}
      <div
        className={`mt-4 grid gap-1 ${
          viewMode === "month" ? "grid-cols-7" : "grid-cols-7"
        }`}
      >
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium uppercase tracking-wider text-gray-400"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {viewMode === "month" ? (
        <div className="mt-1 grid grid-cols-7 gap-1">
          {getMonthDays().map((date) => renderDayCell(date, false))}
        </div>
      ) : (
        <div className="mt-1 grid grid-cols-7 gap-1">
          {getWeekDays().map((date) => renderDayCell(date, true))}
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-10 w-56 rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          {tooltip.workouts.map((w) => (
            <div key={w.id} className="mb-1.5 last:mb-0">
              <p className="text-xs font-medium text-gray-900">{w.title}</p>
              <p className="text-xs text-gray-500">
                {w.exercises.length} exercise
                {w.exercises.length !== 1 ? "s" : ""} &middot;{" "}
                {calcVolume(w.exercises).toLocaleString()} lbs
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
