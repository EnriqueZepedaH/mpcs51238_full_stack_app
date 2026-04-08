import { MuscleGroup } from "@/lib/types";

export default function MuscleGroupBadge({
  muscleGroup,
}: {
  muscleGroup: MuscleGroup;
}) {
  return (
    <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
      {muscleGroup}
    </span>
  );
}
