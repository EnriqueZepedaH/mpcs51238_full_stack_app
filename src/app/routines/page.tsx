"use client";

import Link from "next/link";
import { useWorkouts } from "@/lib/workout-context";
import PageHeader from "@/components/page-header";
import RoutineCard from "@/components/routine-card";

export default function RoutinesPage() {
  const { state } = useWorkouts();

  if (state.loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  const { routines } = state;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Routines"
        subtitle={`${routines.length} routine${routines.length !== 1 ? "s" : ""}`}
        actionLabel="Create Routine"
        actionHref="/routines/new"
      />

      {routines.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-sm text-gray-500">No routines yet</p>
          <Link
            href="/routines/new"
            className="mt-2 inline-block text-sm font-medium text-gray-900 hover:text-gray-700"
          >
            Create your first routine
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {routines.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} />
          ))}
        </div>
      )}
    </div>
  );
}
