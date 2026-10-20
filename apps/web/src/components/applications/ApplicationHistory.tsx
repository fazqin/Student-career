import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatCompactDate } from "@/utils/format";
import { applicationStages } from "@/data/mockData";

const ALL_STATUSES = [
  "Wishlist",
  "Applied",
  "Assessment",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

const ALL_STAGES = [...new Set([...applicationStages, "Withdrawn"])];

function statusBadgeClass(status: string): string {
  switch (status) {
    case "Withdrawn":
      return "border-slate-300 bg-slate-100 text-slate-500";
    case "Rejected":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "Offer":
      return "border-teal-200 bg-teal-50 text-teal-800";
    case "Interview":
      return "border-sky-200 bg-sky-50 text-sky-800";
    case "Assessment":
      return "border-amber-200 bg-amber-50 text-amber-800";
    case "Applied":
      return "border-indigo-200 bg-indigo-50 text-indigo-800";
    case "Wishlist":
      return "border-purple-200 bg-purple-50 text-purple-800";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export function ApplicationHistory({
  applications,
  loading,
  error,
  onInspect,
}: {
  applications: any[];
  loading?: boolean;
  error?: string;
  onInspect?: (app: any) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");

  const hasFilters =
    search.trim() !== "" || statusFilter !== "All" || stageFilter !== "All";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (applications ?? []).filter((a) => {
      const matchesSearch =
        !q ||
        (a.company?.name ?? "").toLowerCase().includes(q) ||
        (a.position?.title ?? "").toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "All" || a.status === statusFilter;
      const matchesStage =
        stageFilter === "All" || a.stage === stageFilter;
      return matchesSearch && matchesStatus && matchesStage;
    });
  }, [applications, search, statusFilter, stageFilter]);

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
    setStageFilter("All");
  }

  if (loading) {
    return (
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
          <div className="mt-3 text-sm text-slate-500">Loading history…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-lg border border-rose-200 bg-rose-50 shadow-sm">
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="text-2xl">warning</div>
          <div className="mt-3 text-sm font-medium text-rose-800">Failed to load history</div>
          <div className="mt-1 text-xs text-rose-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            id="history-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or role..."
            className={cn(
              "h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-900",
              "placeholder:text-slate-400 transition hover:border-slate-300",
              "focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            )}
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="history-status-filter" className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
            Status
          </label>
          <select
            id="history-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={cn(
              "h-9 rounded-lg border border-slate-200 bg-white px-2 pr-7 text-xs text-slate-700",
              "transition hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            )}
          >
            <option value="All">All statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="history-stage-filter" className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
            Stage
          </label>
          <select
            id="history-stage-filter"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className={cn(
              "h-9 rounded-lg border border-slate-200 bg-white px-2 pr-7 text-xs text-slate-700",
              "transition hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            )}
          >
            <option value="All">All stages</option>
            {ALL_STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 h-9 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}

        <span className="ml-auto text-[11px] text-slate-400 whitespace-nowrap">
          {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {applications.length === 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="text-3xl">no-data</div>
            <div className="mt-3 text-sm font-medium text-slate-700">No application history yet</div>
            <div className="mt-1 text-xs text-slate-500">
              Applications you create will appear here, including withdrawn and completed ones.
            </div>
          </div>
        </div>
      )}

      {applications.length > 0 && filtered.length === 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <div className="text-3xl">search</div>
            <div className="mt-3 text-sm font-medium text-slate-700">No matching records</div>
            <div className="mt-1 text-xs text-slate-500">Try adjusting your search or filters.</div>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-lg border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[860px] w-full border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-xs text-slate-500">
                  {["Company", "Role", "Status", "Priority", "Applied", "Deadline", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-4 font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const pos = a.position;
                  const company = a.company;
                  const pri = a.priority as string;
                  const status = a.status ?? a.stage ?? "Unknown";
                  const isTerminal = status === "Withdrawn" || status === "Rejected";

                  return (
                    <tr
                      key={a.id}
                      className={cn(
                        "border-b border-slate-100 text-sm last:border-0 transition",
                        isTerminal ? "bg-slate-50/60 hover:bg-slate-100/60" : "hover:bg-slate-50"
                      )}
                    >
                      <td className="px-5 py-4 max-w-[160px]">
                        <div className="truncate text-xs font-semibold text-slate-900" title={company?.name}>
                          {company?.name ?? "-"}
                        </div>
                        <div className="mt-0.5 truncate text-[11px] text-slate-500" title={company?.industry}>
                          {company?.industry ?? "-"}
                        </div>
                      </td>
                      <td className="px-5 py-4 max-w-[200px]">
                        <div className="truncate text-xs font-semibold text-slate-900" title={pos?.title}>
                          {pos?.title ?? "-"}
                        </div>
                        <div className="mt-0.5 truncate text-[11px] text-slate-500">
                          {pos?.team ?? "-"}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium", statusBadgeClass(status))}>
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn(
                          "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium",
                          pri === "High" ? "border-rose-200 bg-rose-50 text-rose-800"
                            : pri === "Low" ? "border-slate-200 bg-slate-50 text-slate-700"
                            : "border-amber-200 bg-amber-50 text-amber-800"
                        )}>
                          {pri ?? "-"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {a.appliedDate ? formatCompactDate(a.appliedDate) : a.createdAt ? formatCompactDate(a.createdAt) : "-"}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {a.deadline ? formatCompactDate(a.deadline) : "-"}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => onInspect?.(a)}
                          className="text-xs font-medium text-teal-700 hover:text-teal-900 transition"
                        >
                          {isTerminal ? "View" : "Edit"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
