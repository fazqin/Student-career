import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import { formatCompactDate } from "@/utils/format";
import { getPosition, getPositionCompany } from "@/utils/join";

export function ApplicationTable({ applications }: { applications: any[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-xs text-slate-500">
              {["Company", "Role", "Stage", "Priority", "Updated", "Deadline"].map((h) => (
                <th key={h} className="px-5 py-4 font-semibold uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(applications ?? []).map((a) => {
              const pos = getPosition(a.positionId);
              const company = pos ? getPositionCompany(pos.id) : undefined;
              const deadline = pos?.deadline;
              const pri = a.priority as string;

              return (
                <tr
                  key={a.id}
                  className="border-b border-slate-100 text-sm transition hover:bg-slate-50 last:border-0"
                >
                  <td className="px-5 py-4">
                    <div className="text-xs font-semibold text-slate-900">{company?.name ?? "Company"}</div>
                    <div className="mt-1 text-[11px] text-slate-500">{company?.industry ?? "—"}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-xs font-semibold text-slate-900">{pos?.title ?? "Position"}</div>
                    <div className="mt-1 text-[11px] text-slate-500">{pos?.team ?? "Team"}</div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="stage">{a.stage}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium",
                        pri === "High"
                          ? "border-rose-200 bg-rose-50 text-rose-800"
                          : pri === "Low"
                            ? "border-slate-200 bg-slate-50 text-slate-700"
                            : "border-amber-200 bg-amber-50 text-amber-800"
                      )}
                    >
                      {pri}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">{formatCompactDate(a.updatedAt)}</td>
                  <td className="px-5 py-4 text-xs text-slate-500">
                    {deadline ? formatCompactDate(deadline) : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
