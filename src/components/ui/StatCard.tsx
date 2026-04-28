import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  icon,
  hint
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  hint: string;
}) {
  return (
    <div className="panel-muted flex min-h-36 flex-col justify-between p-5">
      <div className="flex items-center justify-between text-mist-300">
        <span className="text-sm">{label}</span>
        <span className="rounded-2xl border border-white/10 bg-white/[0.03] p-2 text-mist-200">
          {icon}
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-semibold tracking-tight text-mist-50">{value}</p>
        <p className="text-sm text-mist-400">{hint}</p>
      </div>
    </div>
  );
}
