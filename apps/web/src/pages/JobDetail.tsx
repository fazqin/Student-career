
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

import {
  getPositionById,
  isSavedPosition,
  toggleSavedPosition,
  createApplication,
  getApplications,
} from "@/services/api";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getCompany } from "@/utils/join";

export default function JobDetail() {
  const { id } = useParams();

  const [position, setPosition] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [adding, setAdding] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applicationError, setApplicationError] = useState("");
  const [applicationPriority, setApplicationPriority] = useState("Medium");
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    let alive = true;

    async function loadPosition() {
      if (!id) return;

      try {
        const p = await getPositionById(id);
        const s = await isSavedPosition(id);

        if (!alive) return;

        setPosition(p);
        setSaved(s);
        const applications = await getApplications();

        const applied = applications.some(
          (a: any) =>
            String(a.positionId) === String(id) &&
            a.userId === "8f24333c-16ba-496a-9090-7f0438e498f3"
        );

setAlreadyApplied(applied);
      } catch (error) {
        console.error("Failed to load position:", error);
      }
    }

    loadPosition();

    return () => {
      alive = false;
    };

    
  }, [id]);

  // Gunakan data perusahaan dari API terlebih dahulu.
  // Fallback ke getCompany() jika data relasi belum tersedia.
  const company = useMemo(
    () =>
      position
        ? position.company ?? getCompany(position.companyId)
        : null,
    [position]
  );

  async function onToggle() {
    if (!position) return;

    try {
      const result = await toggleSavedPosition(position.id);
      setSaved(result.saved);
    } catch (error) {
      console.error("Failed to toggle saved position:", error);
    }
  }

  async function onAddToApplications() {
  if (!position || adding || alreadyApplied) return;

  setAdding(true);
  setApplicationMessage("");
  setApplicationError("");

  try {
    await createApplication({
      position_id: position.id,
      status: "Applied",
      priority: applicationPriority,
      deadline: position.deadline ?? null,
      notes: null,
    });

    setAlreadyApplied(true);
    window.alert("Position has been applied");
    setApplicationMessage("Position has been applied");
  } catch (error) {
    setApplicationError(
      error instanceof Error
        ? error.message
        : "Failed to apply for this position."
    );
  } finally {
    setAdding(false);
  }
}
  
  if (!position) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-white/60">
        Loading…
      </div>
    );
  }

  const deadlineLabel = position.deadline
    ? new Date(position.deadline).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No deadline";

  const salaryLabel = position.salaryRange || "Not specified";
  const companyName = company?.name || "Unknown company";
  const companyIndustry = company?.industry || position.team || "General";
  const companySize = company?.size ?? company?.company_size;
  const companyWebsite = company?.website;

  return (
    <div data-ct-light className="space-y-4">
      <div className="flex items-center justify-between">
        <Link
          to="/jobs"
          className="focus-ring inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
      </div>

      <Card className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div
                className="h-12 w-12 rounded-lg border border-slate-200"
                style={{
                  background: `${company?.brandColor ?? company?.brand_color ?? "#64748B"}22`,
                }}
              />

              <div className="min-w-0">
                <div className="truncate text-2xl font-semibold tracking-tight text-slate-900">
                  {position.title}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                    <Building2 className="h-4 w-4" />
                    {companyName}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                    <MapPin className="h-4 w-4" />
                    {position.location || "Location not specified"}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                    <Clock className="h-4 w-4" />
                    Deadline {deadlineLabel}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="stage">
                {position.type || position.work_type || "Internship"}
              </Badge>

              <Badge variant="default">
                {position.team || companyIndustry}
              </Badge>

              <Badge variant="info">{companyIndustry}</Badge>

              {companySize && (
                <Badge variant="default">
                  {companySize} employees
                </Badge>
              )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">
                  Compensation
                </div>

                <div className="mt-2 text-sm font-semibold text-slate-800">
                  {salaryLabel}
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">
                  Quality signal
                </div>

                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <BadgeCheck className="h-4 w-4 text-slate-700" />
                  Strong fit for your focus
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:w-[280px]">
            <label className="text-sm text-slate-700">
              Priority
              <select
                value={applicationPriority}
                onChange={(e) => setApplicationPriority(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-3"
              >
                {["Low", "Medium", "High"].map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </label>
            <Button
              variant="primary"
              size="lg"
              onClick={onAddToApplications}
              disabled={adding || alreadyApplied}
            >
              {adding
                ? "Adding..."
                : alreadyApplied
                  ? "Already Applied"
                  : "Add to Applications"}
            </Button>

            {applicationMessage && (
              <p
                role="status"
                className="text-sm text-emerald-700"
              >
                {applicationMessage}
              </p>
            )}

            {applicationError && (
              <p
                role="alert"
                className="text-sm text-red-600"
              >
                {applicationError}
              </p>
            )}

            <Button
              variant="secondary"
              size="lg"
              onClick={onToggle}
            >
              <Bookmark
                className={
                  saved ? "h-4 w-4 fill-white" : "h-4 w-4"
                }
              />
              {saved ? "Saved" : "Save"}
            </Button>

            {companyWebsite && (
              <a
                href={companyWebsite}
                target="_blank"
                rel="noreferrer"
              >
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full"
                >
                  Company site
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-semibold text-slate-900">
                Role narrative
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {position.description ||
                  "No job description provided yet."}
              </p>

              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>
                  • Build UI and systems with strong UX fundamentals
                </li>
                <li>
                  • Collaborate with product/design, iterate fast,
                  measure outcomes
                </li>
                <li>
                  • Write clean, testable code with pragmatic tradeoffs
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <div className="text-sm font-semibold text-slate-900">
                Keywords
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(position.tags ?? []).map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
                  >
                    {tag}
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
