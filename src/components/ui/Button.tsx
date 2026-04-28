import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../lib/utils";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost" | "danger";
  }
>;

export function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-accent-400/50 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-accent-500 text-white shadow-soft hover:bg-accent-400",
        variant === "secondary" &&
          "border border-white/10 bg-white/6 text-mist-50 hover:bg-white/10",
        variant === "ghost" &&
          "text-mist-200 hover:bg-white/6",
        variant === "danger" &&
          "bg-rose-400/20 text-rose-200 hover:bg-rose-400/30",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
