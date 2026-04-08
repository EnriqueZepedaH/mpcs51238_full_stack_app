export default function StatsCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string | number;
  subtext?: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      {subtext && <p className="mt-1 text-sm text-gray-500">{subtext}</p>}
    </div>
  );
}
