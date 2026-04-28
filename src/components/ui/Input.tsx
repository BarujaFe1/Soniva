import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-mist-50 outline-none transition placeholder:text-mist-500 focus:border-accent-400/60 focus:ring-2 focus:ring-accent-400/20",
        className
      )}
      {...props}
    />
  );
}
