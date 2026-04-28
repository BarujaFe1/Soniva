import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-2xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-mist-50 outline-none transition focus:border-accent-400/60 focus:ring-2 focus:ring-accent-400/20",
        className
      )}
      {...props}
    />
  );
}
