import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

export function StatCard({
  title,
  value,
  hint,
  icon,
  accent = "indigo",
}: {
  title: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  accent?: "indigo" | "sky" | "green" | "rose";
}) {
  const glow =
    accent === "sky"
      ? "shadow-sm border-sky-200 bg-sky-50"
      : accent === "green"
        ? "shadow-sm border-teal-200 bg-teal-50"
        : accent === "rose"
          ? "shadow-sm border-rose-200 bg-rose-50"
          : "shadow-sm border-slate-200 bg-white";

  return (
    <Card className={cn("rounded-lg border p-5", glow)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500">{title}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
          {hint && <div className="mt-2 text-xs text-slate-400">{hint}</div>}
        </div>
        {icon && (
          <div className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
