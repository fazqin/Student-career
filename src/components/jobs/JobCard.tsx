import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import { getCompany } from "@/utils/join";
import { isSavedPosition, toggleSavedPosition } from "@/services/api";

export function JobCard({ position }: { position: any }) {
  const company = getCompany(position.companyId);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const s = await isSavedPosition(position.id);
      if (alive) setSaved(s);
    })();
    return () => {
      alive = false;
    };
  }, [position.id]);

  async function onToggleSaved(e: React.MouseEvent) {
    e.preventDefault();
    const r = await toggleSavedPosition(position.id);
    setSaved(r.saved);
  }

  return (
    <Link to={`/jobs/${position.id}`} className="block">
      <Card className="group rounded-lg border-slate-200 bg-white p-5 transition hover:border-teal-400 hover:bg-slate-50">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div
                className="h-9 w-9 rounded-lg border border-slate-200"
                style={{ background: `${company?.brandColor ?? "#64748B"}22` }}
              />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{position.title}</div>
                <div className="mt-1 truncate text-xs text-slate-500">{company?.name ?? "Company"} · {position.team}</div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge variant="stage">{position.type}</Badge>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600">
                <MapPin className="h-3.5 w-3.5" /> {position.location}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600">
                <Clock className="h-3.5 w-3.5" /> Deadline {new Date(position.deadline).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(position.tags ?? []).slice(0, 4).map((t: string) => (
                <span
                  key={t}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            className={cn(
              "focus-ring grid h-10 w-10 place-items-center rounded-lg border transition",
              saved
                ? "border-teal-200 bg-teal-50 text-teal-800"
                : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            )}
            aria-label={saved ? "Unsave job" : "Save job"}
            onClick={onToggleSaved}
          >
            <Bookmark className={cn("h-4 w-4", saved && "fill-teal-700")} />
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="text-xs text-slate-500">{position.salaryRange}</div>
          <div className="text-xs text-teal-700 transition group-hover:text-teal-800">
            View details →
          </div>
        </div>
      </Card>
    </Link>
  );
}
