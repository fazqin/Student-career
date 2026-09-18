import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

type BadgeVariant = "default" | "info" | "success" | "warning" | "danger" | "stage";

const styles: Record<BadgeVariant, string> = {
  default: "border-slate-200 bg-slate-50 text-slate-700",
  info: "border-[rgb(var(--info)/0.28)] bg-[rgb(var(--info)/0.12)] text-sky-700",
  success: "border-[rgb(var(--success)/0.28)] bg-[rgb(var(--success)/0.12)] text-teal-800",
  warning: "border-[rgb(var(--warning)/0.3)] bg-[rgb(var(--warning)/0.14)] text-amber-800",
  danger: "border-[rgb(var(--danger)/0.28)] bg-[rgb(var(--danger)/0.12)] text-rose-800",
  stage: "border-slate-200 bg-slate-50 text-slate-700",
};

export function Badge({
  className,
  variant = "default",
  children,
}: {
  className?: string;
  variant?: BadgeVariant;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
