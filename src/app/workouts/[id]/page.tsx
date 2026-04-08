"use client";

import { use } from "react";

export default function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        Workout Detail
      </h1>
      <p className="mt-2 text-sm text-gray-500">Workout ID: {id}</p>
    </div>
  );
}
