import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  ExternalLink,
  Building2,
  MapPin,
  Clock,
  BadgeCheck,
} from "lucide-react";
import { getPositionById, isSavedPosition, toggleSavedPosition } from "@/services/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getCompany } from "@/utils/join";

export default function JobDetail() {
  const { id } = useParams();
  const [position, setPosition] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) return;
      const p = await getPositionById(id);
      const s = await isSavedPosition(id);
      if (!alive) return;
      setPosition(p);
      setSaved(s);
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const company = useMemo(() => (position ? getCompany(position.companyId) : null), [position]);

  async function onToggle() {
    if (!position) return;
    const r = await toggleSavedPosition(position.id);
    setSaved(r.saved);
  }

  if (!position) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-white/60">Loading…</div>
    );
  }

  return (
    <div data-ct-light className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          to="/jobs"
          className="focus-ring inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Jobs
        </Link>
      </div>

      <Card className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-lg border border-slate-200"
                style={{ background: `${company?.brandColor ?? "#64748B"}22` }}
              />
              <div className="min-w-0">
                <div className="truncate text-2xl font-semibold tracking-tight text-slate-900">
                  {position.title}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                    <Building2 className="h-4 w-4" /> {company?.name}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                    <MapPin className="h-4 w-4" /> {position.location}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                    <Clock className="h-4 w-4" /> Deadline{" "}
                    {new Date(position.deadline).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="stage">{position.type}</Badge>
              <Badge variant="default">{position.team}</Badge>
              <Badge variant="info">{company?.industry}</Badge>
              <Badge variant="default">{company?.size} employees</Badge>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Compensation</div>
                <div className="mt-2 text-sm font-semibold text-slate-800">{position.salaryRange}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Quality signal</div>
                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <BadgeCheck className="h-4 w-4 text-slate-700" /> Strong fit for your focus
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:w-[280px]">
            <Button variant="primary" size="lg">
              Add to Applications
            </Button>
            <Button variant="secondary" size="lg" onClick={onToggle}>
              <Bookmark className={saved ? "h-4 w-4 fill-white" : "h-4 w-4"} />
              {saved ? "Saved" : "Save"}
            </Button>
            <a href={company?.website} target="_blank" rel="noreferrer">
              <Button variant="ghost" size="lg" className="w-full">
                Company site <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-xs text-teal-800">
              Demo note: “Add to Applications” would create an application via REST later.
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-semibold text-slate-900">Role narrative</div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                You’ll work in a small team shipping real features. The ideal intern cares about
                clarity, reliability, and craft — not just shipping code.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>• Build UI and systems with strong UX fundamentals</li>
                <li>• Collaborate with product/design, iterate fast, measure outcomes</li>
                <li>• Write clean, testable code with pragmatic tradeoffs</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-semibold text-slate-900">Keywords</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {(position.tags ?? []).map((t: string) => (
                  <span
                    key={t}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-6 text-xs text-slate-500">
                Pro tip: Tailor your top projects to match these keywords.
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
