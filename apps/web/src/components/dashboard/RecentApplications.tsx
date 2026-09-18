import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getPosition, getPositionCompany } from "@/utils/join";

export function RecentApplications({ applications }: { applications: any[] }) {
  return (
    <Card className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">Recent Applications</div>
          <div className="mt-1 text-xs text-slate-500">Latest updates</div>
        </div>
        <Link to="/applications" className="text-xs text-slate-500 hover:text-slate-900">
          View all
        </Link>
      </div>

      <div className="mt-6 space-y-2">
        {(applications ?? []).slice(0, 6).map((a) => {
          const pos = getPosition(a.positionId);
          const company = pos ? getPositionCompany(pos.id) : undefined;
          return (
            <div
              key={a.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-teal-400 hover:bg-white"
            >
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-slate-800">
                  {pos?.title ?? "Position"}
                </div>
                <div className="mt-1 truncate text-[11px] text-slate-500">
                  {company?.name ?? "Company"}
                </div>
              </div>
              <Badge variant="stage">{a.stage}</Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
