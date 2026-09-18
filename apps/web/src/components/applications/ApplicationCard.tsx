import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import { getPosition, getPositionCompany } from "@/utils/join";

export function ApplicationCard({ app }: { app: any }) {
  const pos = getPosition(app.positionId);
  const company = pos ? getPositionCompany(pos.id) : undefined;

  const pri = app.priority as string;
  const priStyle =
    pri === "High"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : pri === "Low"
        ? "border-slate-200 bg-slate-50 text-slate-700"
        : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 transition hover:border-teal-400 hover:bg-slate-50 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-xs font-semibold text-slate-900">{pos?.title ?? "Position"}</div>
          <div className="mt-1 truncate text-[11px] text-slate-500">{company?.name ?? "Company"}</div>
        </div>
        <Badge className={cn("border", priStyle)} variant="default">
          {pri}
        </Badge>
      </div>
      {app.notes && <div className="mt-2 line-clamp-2 text-[11px] text-slate-500">{app.notes}</div>}
    </div>
  );
}
