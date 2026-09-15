import { cn } from "@/utils/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type Size = "sm" | "md" | "lg";

const base =
  "focus-ring inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition will-change-transform disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-[rgb(var(--gold))] text-[rgb(var(--hero-bg))] shadow-[0_12px_28px_-14px_rgb(234_179_8_/_0.9)] hover:bg-yellow-400 hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-[rgb(var(--accent2))] text-white shadow-[0_12px_28px_-14px_rgb(20_184_166_/_0.8)] hover:bg-teal-400 hover:-translate-y-0.5 active:translate-y-0",
  ghost:
    "border border-current/20 text-current hover:bg-current/10 hover:-translate-y-0.5 active:translate-y-0",
  danger:
    "bg-[rgb(var(--danger))] text-white hover:-translate-y-0.5 active:translate-y-0",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function Button({
  className,
  variant = "secondary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}
