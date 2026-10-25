import { useEffect, useMemo, useState } from "react";
import { getInterviews, getApplications } from "@/services/api";
import { Card } from "@/components/ui/Card";
import { formatLongDateTime } from "@/utils/format";

export default function Interviews() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [intvs, apps] = await Promise.all([
          getInterviews(),
          getApplications().catch(() => []),
        ]);

        if (!alive) return;

        // Combine direct interview records and any application with status 'Interview'
        const applicationInterviews = (apps || [])
          .filter((a: any) => (a.status || a.stage) === "Interview")
          .map((a: any) => ({
            id: `app_${a.id}`,
            applicationId: String(a.id),
            title: `${a.position?.title || a.position_title || "Position"} Interview`,
            contact: a.company?.name || a.company_name || "Hiring Team",
            location: "Online (Google Meet)",
            date: a.deadline || a.updatedAt || a.updated_at || new Date().toISOString(),
          }));

        // Deduplicate by applicationId or id
        const map = new Map<string, any>();
        for (const item of intvs || []) {
          const key = item.applicationId ? `app_${item.applicationId}` : String(item.id);
          map.set(key, item);
        }
        for (const item of applicationInterviews) {
          if (!map.has(item.id)) {
            map.set(item.id, item);
          }
        }

        setItems(Array.from(map.values()));
      } catch (err) {
        console.error("Failed to load interviews:", err);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const upcoming = useMemo(
    () =>
      [...items].sort(
        (a, b) =>
          new Date(a.date || a.interview_date).getTime() -
          new Date(b.date || b.interview_date).getTime()
      ),
    [items]
  );

  return (
    <div data-ct-light className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xs text-slate-500">Interview timeline</div>
        <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          Upcoming interviews, organized.
        </div>
        <div className="mt-2 text-sm text-slate-500">
          A calm timeline to stay prepared — agenda, time, location.
        </div>
      </div>

      <Card className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">Next sessions</div>
            <div className="mt-1 text-xs text-slate-500">Sorted by date</div>
          </div>
          <div className="text-xs text-slate-400">{upcoming.length}</div>
        </div>

        <div className="mt-6 space-y-3">
          {upcoming.map((i) => (
            <div
              key={i.id}
              className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition hover:border-teal-400 hover:bg-white"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">
                    {i.title || (i.position ? `${i.position} Interview` : "Interview")}
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    {i.contact || i.company || "Hiring Manager"}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    {i.location || i.type || "Online (Google Meet)"}
                  </div>
                </div>
                <div className="text-sm font-medium text-slate-700">
                  {formatLongDateTime(i.date || i.interview_date)}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {["Review role narrative", "Prepare 2 stories", "Draft questions"].map((t) => (
                  <div key={t} className="rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {upcoming.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
              No interviews scheduled.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
