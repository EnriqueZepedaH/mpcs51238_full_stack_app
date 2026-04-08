"use client";

import { useState } from "react";
import { Exercise } from "@/lib/types";
import { getMuscleGroupVolumes } from "@/lib/utils";

interface MuscleHeatmapProps {
  exercises: Exercise[];
  className?: string;
}

const INACTIVE = "#E5E7EB";
const SCALE = ["#BBF7D0", "#86EFAC", "#4ADE80", "#22C55E", "#16A34A"];

function getColor(volume: number, maxVolume: number): string {
  if (!volume || !maxVolume) return INACTIVE;
  const ratio = volume / maxVolume;
  const idx = Math.min(Math.floor(ratio * SCALE.length), SCALE.length - 1);
  return SCALE[idx];
}

export default function MuscleHeatmap({
  exercises,
  className = "",
}: MuscleHeatmapProps) {
  const volumes = getMuscleGroupVolumes(exercises);
  const maxVol = Math.max(...Object.values(volumes), 1);
  const [tooltip, setTooltip] = useState<{
    name: string;
    volume: number;
    x: number;
    y: number;
  } | null>(null);

  // "Full Body" distributes a fraction across all groups
  const fullBodyVol = volumes["Full Body"] || 0;
  const boost = fullBodyVol > 0 ? fullBodyVol * 0.15 : 0;

  function vol(group: string): number {
    return (volumes[group] || 0) + boost;
  }

  function color(group: string): string {
    return getColor(vol(group), maxVol);
  }

  function handleHover(
    e: React.MouseEvent,
    name: string,
    volume: number
  ) {
    const rect = (e.target as SVGElement).closest("svg")!.getBoundingClientRect();
    setTooltip({
      name,
      volume,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 10,
    });
  }

  function clearTooltip() {
    setTooltip(null);
  }

  const regionProps = (group: string) => ({
    fill: color(group),
    stroke: "#D1D5DB",
    strokeWidth: 0.5,
    className: "transition-colors duration-200 cursor-pointer",
    onMouseMove: (e: React.MouseEvent) => handleHover(e, group, vol(group)),
    onMouseLeave: clearTooltip,
  });

  return (
    <div
      className={`relative rounded-lg border border-gray-200 bg-white p-5 ${className}`}
    >
      <h3 className="mb-3 text-sm font-medium text-gray-900">
        Muscles Targeted
      </h3>
      <div className="flex items-center justify-center gap-8">
        {/* Front View */}
        <div className="text-center">
          <svg viewBox="0 0 120 260" width="110" height="240">
            {/* Head */}
            <ellipse cx="60" cy="20" rx="14" ry="16" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth={0.5} />

            {/* Neck */}
            <rect x="53" y="35" width="14" height="10" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth={0.5} />

            {/* Shoulders (front delts) */}
            <ellipse cx="30" cy="55" rx="12" ry="8" {...regionProps("Shoulders")} />
            <ellipse cx="90" cy="55" rx="12" ry="8" {...regionProps("Shoulders")} />

            {/* Chest (pectorals) */}
            <path
              d="M38 48 Q60 44 82 48 Q84 62 82 70 Q60 74 38 70 Q36 62 38 48Z"
              {...regionProps("Chest")}
            />

            {/* Biceps */}
            <path
              d="M18 62 Q14 80 16 100 Q22 102 26 100 Q28 80 26 62Z"
              {...regionProps("Biceps")}
            />
            <path
              d="M102 62 Q106 80 104 100 Q98 102 94 100 Q92 80 94 62Z"
              {...regionProps("Biceps")}
            />

            {/* Forearms */}
            <path d="M16 102 Q13 120 14 138 Q20 140 22 138 Q24 120 24 102Z" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth={0.5} />
            <path d="M104 102 Q107 120 106 138 Q100 140 98 138 Q96 120 96 102Z" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth={0.5} />

            {/* Core / Abs */}
            <path
              d="M42 72 Q60 76 78 72 L78 110 Q60 114 42 110Z"
              {...regionProps("Core")}
            />

            {/* Quads (Legs front) */}
            <path
              d="M38 114 Q36 150 34 185 Q44 188 50 185 Q52 150 54 114Z"
              {...regionProps("Legs")}
            />
            <path
              d="M82 114 Q84 150 86 185 Q76 188 70 185 Q68 150 66 114Z"
              {...regionProps("Legs")}
            />

            {/* Calves (front/shin) */}
            <path d="M34 190 Q33 215 34 240 Q42 242 46 240 Q48 215 48 190Z" {...regionProps("Calves")} />
            <path d="M86 190 Q87 215 86 240 Q78 242 74 240 Q72 215 72 190Z" {...regionProps("Calves")} />
          </svg>
          <p className="mt-1 text-xs text-gray-400">Front</p>
        </div>

        {/* Back View */}
        <div className="text-center">
          <svg viewBox="0 0 120 260" width="110" height="240">
            {/* Head */}
            <ellipse cx="60" cy="20" rx="14" ry="16" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth={0.5} />

            {/* Neck */}
            <rect x="53" y="35" width="14" height="10" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth={0.5} />

            {/* Shoulders (rear delts) */}
            <ellipse cx="30" cy="55" rx="12" ry="8" {...regionProps("Shoulders")} />
            <ellipse cx="90" cy="55" rx="12" ry="8" {...regionProps("Shoulders")} />

            {/* Upper Back / Traps */}
            <path
              d="M38 48 Q60 44 82 48 Q84 58 82 65 Q60 68 38 65 Q36 58 38 48Z"
              {...regionProps("Back")}
            />

            {/* Lats */}
            <path
              d="M36 66 Q34 80 36 95 Q48 100 60 98 Q60 80 50 66Z"
              {...regionProps("Back")}
            />
            <path
              d="M84 66 Q86 80 84 95 Q72 100 60 98 Q60 80 70 66Z"
              {...regionProps("Back")}
            />

            {/* Triceps */}
            <path
              d="M18 62 Q14 80 16 100 Q22 102 26 100 Q28 80 26 62Z"
              {...regionProps("Triceps")}
            />
            <path
              d="M102 62 Q106 80 104 100 Q98 102 94 100 Q92 80 94 62Z"
              {...regionProps("Triceps")}
            />

            {/* Forearms */}
            <path d="M16 102 Q13 120 14 138 Q20 140 22 138 Q24 120 24 102Z" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth={0.5} />
            <path d="M104 102 Q107 120 106 138 Q100 140 98 138 Q96 120 96 102Z" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth={0.5} />

            {/* Lower Back */}
            <path
              d="M42 96 Q60 100 78 96 L78 110 Q60 114 42 110Z"
              {...regionProps("Back")}
            />

            {/* Glutes */}
            <path
              d="M38 112 Q48 118 56 112 L56 130 Q48 136 38 130Z"
              {...regionProps("Glutes")}
            />
            <path
              d="M82 112 Q72 118 64 112 L64 130 Q72 136 82 130Z"
              {...regionProps("Glutes")}
            />

            {/* Hamstrings (Legs back) */}
            <path
              d="M36 132 Q34 155 34 185 Q44 188 50 185 Q52 155 54 132Z"
              {...regionProps("Legs")}
            />
            <path
              d="M84 132 Q86 155 86 185 Q76 188 70 185 Q68 155 66 132Z"
              {...regionProps("Legs")}
            />

            {/* Calves (back) */}
            <path d="M34 190 Q33 215 34 240 Q42 242 46 240 Q48 215 48 190Z" {...regionProps("Calves")} />
            <path d="M86 190 Q87 215 86 240 Q78 242 74 240 Q72 215 72 190Z" {...regionProps("Calves")} />
          </svg>
          <p className="mt-1 text-xs text-gray-400">Back</p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
        <span>Less</span>
        <div className="flex gap-0.5">
          <div className="h-3 w-5 rounded-sm" style={{ background: INACTIVE }} />
          {SCALE.map((c, i) => (
            <div
              key={i}
              className="h-3 w-5 rounded-sm"
              style={{ background: c }}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* Tooltip */}
      {tooltip && tooltip.volume > 0 && (
        <div
          className="pointer-events-none absolute z-10 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-white shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
        >
          <span className="font-medium">{tooltip.name}</span>
          <span className="ml-1.5 text-gray-300">
            {tooltip.volume.toLocaleString()} lbs
          </span>
        </div>
      )}
    </div>
  );
}
