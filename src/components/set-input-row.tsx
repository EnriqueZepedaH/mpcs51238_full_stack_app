"use client";

import { WorkoutSet } from "@/lib/types";

export default function SetInputRow({
  set,
  index,
  onChange,
  onRemove,
}: {
  set: WorkoutSet;
  index: number;
  onChange: (updated: WorkoutSet) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 text-xs font-medium text-gray-400 text-center">
        {index + 1}
      </span>
      <div className="flex-1">
        <input
          type="number"
          min={0}
          placeholder="Reps"
          value={set.reps || ""}
          onChange={(e) =>
            onChange({ ...set, reps: parseInt(e.target.value) || 0 })
          }
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>
      <div className="flex-1">
        <input
          type="number"
          min={0}
          placeholder="Weight (lbs)"
          value={set.weight || ""}
          onChange={(e) =>
            onChange({ ...set, weight: parseInt(e.target.value) || 0 })
          }
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </button>
    </div>
  );
}
