import Link from "next/link";
import { Routine } from "@/lib/types";

export default function RoutineCard({ routine }: { routine: Routine }) {
  const exerciseNames = routine.exercises.map((e) => e.name).join(", ");

  return (
    <Link
      href={`/routines/${routine.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
    >
      <h3 className="font-medium text-gray-900">{routine.name}</h3>
      <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
        <span>
          {routine.exercises.length} exercise
          {routine.exercises.length !== 1 ? "s" : ""}
        </span>
      </div>
      <p className="mt-2 truncate text-sm text-gray-400">{exerciseNames}</p>
    </Link>
  );
}
