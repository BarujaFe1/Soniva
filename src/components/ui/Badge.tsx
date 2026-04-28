import type { PropsWithChildren } from "react";
import { cn } from "../../lib/utils";

export function Badge({
  children,
  tone = "neutral"
}: PropsWithChildren<{ tone?: "neutral" | "success" | "warning" | "danger" | "accent" }>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "neutral" && "bg-white/10 text-mist-200",
        tone === "success" && "bg-mint-400/15 text-mint-400",
        tone === "warning" && "bg-amber-400/15 text-amber-300",
        tone === "danger" && "bg-rose-400/15 text-rose-300",
        tone === "accent" && "bg-accent-400/15 text-accent-300"
      )}
    >
      {children}
    </span>
  );
}
