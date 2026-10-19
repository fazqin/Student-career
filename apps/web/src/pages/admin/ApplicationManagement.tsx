
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  Filter,
  Pencil,
  Search,
  Users,
  X,
} from "lucide-react";

import {
  getAdminPositions,
  getAdminCompanies,
  type Position,
  type Company,
} from "@/services/adminApi";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// ======================================================
// TYPES - SESUAI STRUKTUR DATABASE APPLICATIONS
// ======================================================

type ApplicationStatus =
  | "Applied"
  | "In Review"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Withdrawn";

type ApplicationPriority = "High" | "Medium" | "Low";

interface AdminApplication {
  id: number;
  user_id: string;
  position_id: number;
  status: ApplicationStatus;
  priority: ApplicationPriority;
  applied_date: string | null;
  deadline: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface PositionInfo {
  title: string;
  company: string;
}

// ======================================================
// STATUS & PRIORITY OPTIONS
// ======================================================

const STATUS_OPTIONS: ApplicationStatus[] = [
  "Applied",
  "In Review",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn",
];

const PRIORITY_OPTIONS: ApplicationPriority[] = [
  "High",
  "Medium",
  "Low",
];

// ======================================================
// DATA AWAL - BERDASARKAN APPLICATIONS_ROWS.CSV
// HANYA UNTUK DEMO FRONTEND
// ======================================================

const STUDENT_A = "8f24333c-16ba-496a-9090-7f0438e498f3";
const STUDENT_B = "87eb4379-97ef-4aa6-82cc-44ca4d933d58";

const INITIAL_APPLICATIONS: AdminApplication[] = [
  {
    id: 10,
    user_id: STUDENT_A,
    position_id: 1,
    status: "Applied",
    priority: "High",
    applied_date: "2026-10-16 08:40:11.230521+00",
    deadline: null,
    notes: null,
    created_at: "2026-10-16 08:40:11.230521+00",
    updated_at: "2026-10-18 17:04:20.707561+00",
  },
  {
    id: 11,
    user_id: STUDENT_A,
    position_id: 2,
    status: "Applied",
    priority: "Medium",
    applied_date: "2026-10-16 08:40:21.509288+00",
    deadline: null,
    notes: null,
    created_at: "2026-10-16 08:40:21.509288+00",
    updated_at: "2026-10-16 08:40:21.509288+00",
  },
  {
    id: 12,
    user_id: STUDENT_A,
    position_id: 3,
    status: "Withdrawn",
    priority: "Medium",
    applied_date: "2026-10-16 08:40:31.994469+00",
    deadline: null,
    notes: null,
    created_at: "2026-10-16 08:40:31.994469+00",
    updated_at: "2026-10-18 17:17:18.113808+00",
  },
  {
    id: 13,
    user_id: STUDENT_A,
    position_id: 6,
    status: "Applied",
    priority: "High",
    applied_date: "2026-10-16 08:40:42.866948+00",
    deadline: "2026-12-01 00:00:00+00",
    notes: null,
    created_at: "2026-10-16 08:40:42.866948+00",
    updated_at: "2026-10-16 10:37:47.803208+00",
  },
  {
    id: 14,
    user_id: STUDENT_A,
    position_id: 9,
    status: "Withdrawn",
    priority: "High",
    applied_date: "2026-10-16 08:45:54.169363+00",
    deadline: "2026-12-25 00:00:00+00",
    notes: null,
    created_at: "2026-10-16 08:45:54.169363+00",
    updated_at: "2026-10-18 17:04:33.916128+00",
  },
  {
    id: 15,
    user_id: STUDENT_A,
    position_id: 8,
    status: "Withdrawn",
    priority: "High",
    applied_date: "2026-10-16 09:17:43.079906+00",
    deadline: null,
    notes: null,
    created_at: "2026-10-16 09:17:43.079906+00",
    updated_at: "2026-10-18 17:05:29.561974+00",
  },
  {
    id: 16,
    user_id: STUDENT_B,
    position_id: 9,
    status: "Applied",
    priority: "High",
    applied_date: "2026-10-19 07:25:47.440964+00",
    deadline: null,
    notes: "Test JWT",
    created_at: "2026-10-19 07:25:47.440964+00",
    updated_at: "2026-10-19 07:25:47.440964+00",
  },
];

// Referensi dari positions_rows.csv
// Digunakan jika data posisi dari service belum tersedia.
const POSITION_FALLBACK: Record<
  number,
  { title: string; companyId: string }
> = {
  1: {
    title: "Backend Developer",
    companyId: "1",
  },
  2: {
    title: "Data Scientist Intern",
    companyId: "2",
  },
  3: {
    title: "Wantimpres",
    companyId: "3",
  },
  6: {
    title: "Nuclear Engineer",
    companyId: "4",
  },
  8: {
    title: "ESG developer",
    companyId: "6",
  },
  9: {
    title: "DPR",
    companyId: "3",
  },
};

// ======================================================
// HELPERS
// ======================================================

function formatDate(value?: string | null) {
  if (!value) return "-";

  const normalized = value
    .replace(" ", "T")
    .replace(/\+00$/, "Z");

  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function getDateInputValue(value?: string | null) {
  return value ? value.slice(0, 10) : "";
}

function statusVariant(
  status: ApplicationStatus
): "default" | "info" | "success" | "warning" | "danger" {
  switch (status) {
    case "Applied":
      return "info";

    case "In Review":
      return "warning";

    case "Interview":
      return "warning";

    case "Offer":
      return "success";

    case "Rejected":
      return "danger";

    case "Withdrawn":
      return "default";

    default:
      return "default";
  }
}

function priorityVariant(
  priority: ApplicationPriority
): "default" | "warning" | "danger" {
  switch (priority) {
    case "High":
      return "danger";

    case "Medium":
      return "warning";

    default:
      return "default";
  }
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function ApplicationManagement() {
  // Application data
  const [applications, setApplications] =
    useState<AdminApplication[]>(INITIAL_APPLICATIONS);

  // Reference data
  const [positions, setPositions] = useState<Position[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingReferences, setLoadingReferences] = useState(true);
  const [referenceError, setReferenceError] = useState(false);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");

  // Edit modal
  const [editingApplication, setEditingApplication] =
    useState<AdminApplication | null>(null);

  const [editStatus, setEditStatus] =
    useState<ApplicationStatus>("Applied");

  const [editPriority, setEditPriority] =
    useState<ApplicationPriority>("Medium");

  const [editDeadline, setEditDeadline] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // ====================================================
  // LOAD REFERENCE DATA
  // ====================================================

  useEffect(() => {
    let active = true;

    async function loadReferences() {
      setLoadingReferences(true);

      const [positionResult, companyResult] =
        await Promise.allSettled([
          getAdminPositions(),
          getAdminCompanies(),
        ]);

      if (!active) return;

      if (positionResult.status === "fulfilled") {
        setPositions(positionResult.value);
      }

      if (companyResult.status === "fulfilled") {
        setCompanies(companyResult.value);
      }

      setReferenceError(
        positionResult.status === "rejected" ||
          companyResult.status === "rejected"
      );

      setLoadingReferences(false);
    }

    void loadReferences();

    return () => {
      active = false;
    };
  }, []);

  // ====================================================
  // RESOLVE POSITION & COMPANY DATA
  // ====================================================

  const positionLookup = useMemo(() => {
    const lookup = new Map<string, PositionInfo>();

    for (const application of applications) {
      const positionId = String(application.position_id);

      const servicePosition = positions.find(
        (position) => String(position.id) === positionId
      );

      const fallback =
        POSITION_FALLBACK[application.position_id];

      const title =
        servicePosition?.title?.trim() ||
        fallback?.title ||
        `Position #${positionId}`;

      const companyId =
        servicePosition?.companyId ??
        fallback?.companyId;

      const matchedCompany = companies.find(
        (company) =>
          String(company.id) === String(companyId)
      );

      const serviceCompanyName =
        servicePosition?.companyName;

      let companyName = "Company unavailable";

      if (matchedCompany?.name) {
        companyName = matchedCompany.name;
      } else if (
        serviceCompanyName &&
        serviceCompanyName !== "Company"
      ) {
        companyName = serviceCompanyName;
      } else if (companyId !== undefined) {
        companyName = `Company ID: ${companyId}`;
      }

      lookup.set(positionId, {
        title,
        company: companyName,
      });
    }

    return lookup;
  }, [applications, positions, companies]);

  // ====================================================
  // SUMMARY
  // ====================================================

  const summary = useMemo(() => {
    return {
      total: applications.length,
      applied: applications.filter(
        (application) => application.status === "Applied"
      ).length,
      withdrawn: applications.filter(
        (application) => application.status === "Withdrawn"
      ).length,
      highPriority: applications.filter(
        (application) => application.priority === "High"
      ).length,
    };
  }, [applications]);

  // ====================================================
  // SEARCH & FILTER
  // ====================================================

  const filteredApplications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return applications
      .filter((application) => {
        const position = positionLookup.get(
          String(application.position_id)
        );

        const searchable = [
          String(application.id),
          application.user_id,
          String(application.position_id),
          position?.title || "",
          position?.company || "",
          application.status,
          application.priority,
          application.notes || "",
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !query || searchable.includes(query);

        const matchesStatus =
          selectedStatus === "All" ||
          application.status === selectedStatus;

        const matchesPriority =
          selectedPriority === "All" ||
          application.priority === selectedPriority;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority
        );
      })
      .sort((a, b) => {
        const dateA = a.applied_date || a.created_at;
        const dateB = b.applied_date || b.created_at;

        return dateB.localeCompare(dateA);
      });
  }, [
    applications,
    positionLookup,
    searchQuery,
    selectedStatus,
    selectedPriority,
  ]);

  function resetFilters() {
    setSearchQuery("");
    setSelectedStatus("All");
    setSelectedPriority("All");
  }

  // ====================================================
  // EDIT APPLICATION
  // ====================================================

  function handleOpenEdit(application: AdminApplication) {
    setEditingApplication(application);

    setEditStatus(application.status);
    setEditPriority(application.priority);

    setEditDeadline(
      getDateInputValue(application.deadline)
    );

    setEditNotes(application.notes || "");
  }

  function handleCloseEdit() {
    setEditingApplication(null);
  }

  function handleSaveEdit() {
    if (!editingApplication) return;

    const updatedAt = new Date().toISOString();

    setApplications((previous) =>
      previous.map((application) =>
        application.id === editingApplication.id
          ? {
              ...application,
              status: editStatus,
              priority: editPriority,
              deadline: editDeadline || null,
              notes: editNotes.trim() || null,
              updated_at: updatedAt,
            }
          : application
      )
    );

    handleCloseEdit();
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <div data-ct-light className="space-y-5">
      {/* PAGE HEADER */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Admin Directory
              </span>

              <Badge
                variant="info"
                className="text-[10px] font-semibold"
              >
                {summary.total} Applications
              </Badge>
            </div>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Application Management
            </h2>

            <p className="mt-1 max-w-xl text-xs text-slate-500">
              Manage student applications, monitor
              recruitment progress, and update
              application statuses for CareerTrack.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-medium text-teal-800">
            <ClipboardList className="h-4 w-4" />
            Application Directory
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ClipboardList className="h-4 w-4" />
            Total Applications
          </div>

          <div className="mt-2 text-2xl font-bold text-slate-900">
            {summary.total}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="h-4 w-4 text-teal-600" />
            Applied
          </div>

          <div className="mt-2 text-2xl font-bold text-slate-900">
            {summary.applied}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <X className="h-4 w-4 text-slate-500" />
            Withdrawn
          </div>

          <div className="mt-2 text-2xl font-bold text-slate-900">
            {summary.withdrawn}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <AlertCircle className="h-4 w-4 text-rose-500" />
            High Priority
          </div>

          <div className="mt-2 text-2xl font-bold text-slate-900">
            {summary.highPriority}
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search student ID, position, company..."
              className="bg-slate-50 pl-9 text-xs sm:text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />

            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(event.target.value)
              }
              className="focus-ring h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-700"
            >
              <option value="All">All Status</option>

              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={selectedPriority}
              onChange={(event) =>
                setSelectedPriority(event.target.value)
              }
              className="focus-ring h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-700"
            >
              <option value="All">All Priorities</option>

              {PRIORITY_OPTIONS.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>

            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-slate-600"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* REFERENCE WARNING */}
      {referenceError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          Some position or company references could not
          be loaded. Available IDs and fallback titles
          will be displayed.
        </div>
      )}

      {/* EMPTY STATE */}
      {filteredApplications.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <ClipboardList className="mx-auto h-10 w-10 text-slate-400" />

          <h3 className="mt-3 text-base font-bold text-slate-900">
            No Applications Found
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            No applications match your current
            search or filter.
          </p>

          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="mt-4 text-slate-700"
          >
            Reset Filters
          </Button>
        </div>
      )}

      {/* APPLICATION TABLE */}
      {filteredApplications.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">
                    Student
                  </th>

                  <th className="px-4 py-3.5">
                    Position / Company
                  </th>

                  <th className="px-4 py-3.5">
                    Applied Date
                  </th>

                  <th className="px-4 py-3.5">
                    Deadline
                  </th>

                  <th className="px-4 py-3.5">
                    Priority
                  </th>

                  <th className="px-4 py-3.5">
                    Status
                  </th>

                  <th className="px-4 py-3.5">
                    Notes
                  </th>

                  <th className="px-5 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredApplications.map((application) => {
                  const position = positionLookup.get(
                    String(application.position_id)
                  );

                  return (
                    <tr
                      key={application.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      {/* STUDENT */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                            <Users className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900">
                              Student ID
                            </div>

                            <div
                              className="mt-1 text-[11px] text-slate-500"
                              title={application.user_id}
                            >
                              {application.user_id.slice(0, 8)}...
                            </div>

                            <div className="mt-1 text-[10px] text-slate-400">
                              Application #{application.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* POSITION & COMPANY */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <BriefcaseBusiness className="h-4 w-4 shrink-0 text-teal-600" />

                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900">
                              {position?.title ||
                                `Position #${application.position_id}`}
                            </div>

                            <div className="mt-1 text-[11px] text-slate-500">
                              {position?.company ||
                                "Company unavailable"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* APPLIED DATE */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                          {formatDate(application.applied_date)}
                        </div>
                      </td>

                      {/* DEADLINE */}
                      <td className="px-4 py-4 text-xs">
                        {formatDate(application.deadline)}
                      </td>

                      {/* PRIORITY */}
                      <td className="px-4 py-4">
                        <Badge
                          variant={priorityVariant(
                            application.priority
                          )}
                        >
                          {application.priority}
                        </Badge>
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-4">
                        <Badge
                          variant={statusVariant(
                            application.status
                          )}
                        >
                          {application.status}
                        </Badge>
                      </td>

                      {/* NOTES */}
                      <td className="max-w-[160px] px-4 py-4">
                        {application.notes ? (
                          <div
                            className="flex items-center gap-1.5 text-xs text-slate-600"
                            title={application.notes}
                          >
                            <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400" />

                            <span className="truncate">
                              {application.notes}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            -
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenEdit(application)
                          }
                          title="Update Application"
                          aria-label={`Update application ${application.id}`}
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-teal-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER */}
          <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing{" "}
              <strong className="text-slate-700">
                {filteredApplications.length}
              </strong>{" "}
              of{" "}
              <strong className="text-slate-700">
                {applications.length}
              </strong>{" "}
              applications
            </span>

            <span>
              {loadingReferences
                ? "Loading position references..."
                : "Application Management"}
            </span>
          </div>
        </div>
      )}

      {/* ==================================================
          EDIT APPLICATION MODAL
      ================================================== */}

      {editingApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-application-title"
            className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3
                  id="edit-application-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Update Application
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Application #{editingApplication.id}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseEdit}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
              {/* APPLICATION INFORMATION */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-medium text-slate-500">
                  Position
                </div>

                <div className="mt-1 text-sm font-semibold text-slate-900">
                  {positionLookup.get(
                    String(editingApplication.position_id)
                  )?.title ||
                    `Position #${editingApplication.position_id}`}
                </div>

                <div className="mt-2 text-xs text-slate-500">
                  Student ID: {editingApplication.user_id}
                </div>
              </div>

              {/* STATUS */}
              <div>
                <label
                  htmlFor="application-status"
                  className="mb-2 block text-xs font-semibold text-slate-700"
                >
                  Application Status
                </label>

                <select
                  id="application-status"
                  value={editStatus}
                  onChange={(event) =>
                    setEditStatus(
                      event.target.value as ApplicationStatus
                    )
                  }
                  className="focus-ring h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRIORITY */}
              <div>
                <label
                  htmlFor="application-priority"
                  className="mb-2 block text-xs font-semibold text-slate-700"
                >
                  Priority
                </label>

                <select
                  id="application-priority"
                  value={editPriority}
                  onChange={(event) =>
                    setEditPriority(
                      event.target.value as ApplicationPriority
                    )
                  }
                  className="focus-ring h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800"
                >
                  {PRIORITY_OPTIONS.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              {/* DEADLINE */}
              <div>
                <label
                  htmlFor="application-deadline"
                  className="mb-2 block text-xs font-semibold text-slate-700"
                >
                  Application Deadline
                </label>

                <input
                  id="application-deadline"
                  type="date"
                  value={editDeadline}
                  onChange={(event) =>
                    setEditDeadline(event.target.value)
                  }
                  className="focus-ring h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800"
                />
              </div>

              {/* NOTES */}
              <div>
                <label
                  htmlFor="application-notes"
                  className="mb-2 block text-xs font-semibold text-slate-700"
                >
                  Notes
                </label>

                <textarea
                  id="application-notes"
                  rows={4}
                  value={editNotes}
                  onChange={(event) =>
                    setEditNotes(event.target.value)
                  }
                  placeholder="Add application notes..."
                  className="focus-ring w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCloseEdit}
                className="text-slate-600"
              >
                Cancel
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={handleSaveEdit}
              >
                <CheckCircle2 className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}