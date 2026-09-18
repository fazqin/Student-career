import { Card } from "@/components/ui/Card";
import { formatCompactDate } from "@/utils/format";
import { getPosition, getPositionCompany } from "@/utils/join";

export function UpcomingDeadlines({ applications }: { applications: any[] }) {
  const deadlines = (applications ?? [])
    .map((a) => {
      const pos = getPosition(a.positionId);
      const company = pos ? getPositionCompany(pos.id) : undefined;
      return {
        id: a.id,
        title: pos?.title ?? "Position",
        company: company?.name ?? "Company",
        deadline: pos?.deadline,
        stage: a.stage,
      };
    })
    .filter((d) => Boolean(d.deadline) && d.stage !== "Rejected")
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  return (
    <Card className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">Upcoming Deadlines</div>
          <div className="mt-1 text-xs text-slate-500">Stay ahead of submissions</div>
        </div>
        <div className="text-xs text-slate-400">{deadlines.length}</div>
      </div>

      <div className="mt-6 space-y-2">
        {deadlines.map((d) => (
          <div
            key={d.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-teal-400 hover:bg-white"
          >
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold text-slate-800">{d.title}</div>
              <div className="mt-1 truncate text-[11px] text-slate-500">{d.company}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600">
                {d.stage}
              </div>
              <div className="text-xs text-slate-400">{formatCompactDate(d.deadline)}</div>
            </div>
          </div>
        ))}

        {deadlines.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            No upcoming deadlines.
          </div>
        )}
      </div>
    </Card>
  );
}
