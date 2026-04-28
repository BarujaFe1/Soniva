import type { PropsWithChildren } from "react";

export function EmptyState({
  eyebrow,
  title,
  description,
  children
}: PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
}>) {
  return (
    <div className="panel-muted flex min-h-56 flex-col items-start justify-center gap-4 p-8">
      <span className="rounded-full bg-white/6 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-mist-400">
        {eyebrow}
      </span>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-mist-50">{title}</h3>
        <p className="max-w-2xl text-sm leading-6 text-mist-300">{description}</p>
      </div>
      {children}
    </div>
  );
}
