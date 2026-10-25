import { Card } from "@/components/ui/Card";
import { formatLongDateTime } from "@/utils/format";

export function UpcomingInterviews({ interviews }: { interviews: any[] }) {
  return (
    <Card className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">Upcoming Interviews</div>
          <div className="mt-1 text-xs text-slate-500">Next sessions</div>
        </div>
        <div className="text-xs text-slate-400">{interviews?.length ?? 0}</div>
      </div>

      <div className="mt-6 space-y-3">
        {(interviews ?? []).slice(0, 4).map((i) => {
          const title = i.title || (i.position ? `${i.position} Interview` : "Interview Session");
          const contact = i.contact || i.company || "Hiring Team";
          const location = i.location || i.type || "Online (Google Meet)";
          const dateStr = i.date || i.interview_date || new Date().toISOString();

          return (
            <div
              key={i.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-teal-400 hover:bg-white"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900">{title}</div>
                  <div className="mt-1 truncate text-xs text-slate-600">{contact}</div>
                </div>
                <div className="text-xs font-medium text-slate-500">{formatLongDateTime(dateStr)}</div>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">{location}</div>
            </div>
          );
        })}

        {(!interviews || interviews.length === 0) && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            No interviews scheduled yet.
          </div>
        )}
      </div>
    </Card>
  );
}
