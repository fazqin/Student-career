
import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Plus,
  Search,
  Pencil,
  Trash2,
  MapPin,
  Filter,
  AlertCircle,
  RefreshCw,
  CalendarDays,
} from "lucide-react";

import {
  getAdminPositions,
  getAdminCompanies,
  createAdminPosition,
  updateAdminPosition,
  deleteAdminPosition,
  type Company,
  type Position,
  type PositionStatus,
} from "@/services/adminApi";

import {
  PositionFormModal,
  type PositionFormData,
} from "@/components/admin/PositionFormModal";

import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

// Format tanggal deadline
function formatDeadline(value?: string | null) {
  if (!value) return "No deadline";

  const date = new Date(value.slice(0, 10) + "T00:00:00");

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Warna badge status
function statusVariant(status: PositionStatus) {
  if (status === "Published") return "success";
  if (status === "Draft") return "warning";
  return "default";
}

// Field tambahan untuk tampilan intern status
type PositionView = Position & {
  internStatus?: string;
  intern_status?: string;
};

export default function PositionManagement() {
  // Data utama
  const [positions, setPositions] = useState<Position[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search dan filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Modal Add dan Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPosition, setEditingPosition] =
    useState<Position | null>(null);

  // Modal Delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingPosition, setDeletingPosition] =
    useState<Position | null>(null);

  // Mengambil daftar posisi
  async function loadPositions() {
    setLoading(true);
    setError(null);

    try {
      const data = await getAdminPositions();
      setPositions(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load positions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPositions();
  }, []);

  // Mengambil daftar perusahaan
  useEffect(() => {
    async function loadCompanies() {
      try {
        const data = await getAdminCompanies();
        setCompanies(data);
      } catch (err) {
        console.error("Failed to load companies:", err);
        setCompanies([]);
      }
    }

    void loadCompanies();
  }, []);

  // Daftar Work Type
  const workTypes = useMemo(() => {
    const types = new Set(
      positions.map((position) => position.type).filter(Boolean)
    );

    return ["All", ...Array.from(types)];
  }, [positions]);

  // Hasil Search dan Filter
  const filteredPositions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return positions.filter((position) => {
      const matchesSearch =
        !query ||
        position.title.toLowerCase().includes(query) ||
        (position.companyName || "").toLowerCase().includes(query) ||
        position.location.toLowerCase().includes(query) ||
        position.description.toLowerCase().includes(query);

      const matchesType =
        selectedType === "All" ||
        position.type === selectedType;

      const matchesStatus =
        selectedStatus === "All" ||
        position.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [
    positions,
    searchQuery,
    selectedType,
    selectedStatus,
  ]);

  // Reset filter
  function resetFilters() {
    setSearchQuery("");
    setSelectedType("All");
    setSelectedStatus("All");
  }

  // Membuka Add Position
  function handleOpenAdd() {
    setEditingPosition(null);
    setIsFormOpen(true);
  }

  // Membuka Edit Position
  function handleOpenEdit(position: Position) {
    setEditingPosition(position);
    setIsFormOpen(true);
  }

  // Menutup form
  function handleCloseForm() {
    setIsFormOpen(false);
    setEditingPosition(null);
  }

  // Menyimpan Add atau Edit sementara di UI
  async function handleSavePosition(
  data: PositionFormData,
  id?: string | number
): Promise<void> {
  try {
    if (id !== undefined) {
      // Update existing
      await updateAdminPosition(id, data);
    } else {
      // Create new
      await createAdminPosition(data);
    }
    // Reload data segar dari Supabase
    await loadPositions();
    handleCloseForm();
  } catch (err) {
    console.error("Failed to save position:", err);
  }
}


  // Membuka konfirmasi Delete
  function handleOpenDelete(position: Position) {
    setDeletingPosition(position);
    setIsDeleteOpen(true);
  }

  // Menutup konfirmasi Delete
  function handleCloseDelete() {
    setIsDeleteOpen(false);
    setDeletingPosition(null);
  }

  // Menghapus Position sementara dari UI
  async function handleConfirmDelete(): Promise<void> {
  if (!deletingPosition) return;
  try {
    await deleteAdminPosition(deletingPosition.id);
    await loadPositions();
    handleCloseDelete();
  } catch (err) {
    console.error("Failed to delete position:", err);
  }
}


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
                {positions.length} Positions
              </Badge>
            </div>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Position Management
            </h2>

            <p className="mt-1 max-w-xl text-xs text-slate-500">
              Manage job positions, company assignments,
              employment details, and application deadlines
              for CareerTrack.
            </p>
          </div>

          {/* ADD POSITION BUTTON */}
          <Button
            variant="secondary"
            size="md"
            onClick={handleOpenAdd}
            className="gap-2 font-semibold shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Position
          </Button>
        </div>

        {/* SEARCH & FILTER */}
        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search position, company, or location..."
              className="bg-slate-50 pl-9 text-xs sm:text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="focus-ring h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-700"
            >
              {workTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "All"
                    ? "All Work Types"
                    : type}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="focus-ring h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-700"
            >
              <option value="All">All Status</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
          <AlertCircle className="mx-auto mb-2 h-8 w-8 text-rose-500" />

          <h3 className="text-sm font-bold text-rose-900">
            Failed to Load Positions
          </h3>

          <p className="mt-2 text-xs text-rose-700">
            {error}
          </p>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => void loadPositions()}
            className="mt-4 gap-2 text-rose-800"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex animate-pulse items-center gap-4 rounded-lg border border-slate-100 p-3"
            >
              <div className="h-10 w-10 rounded-lg bg-slate-200" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-slate-200" />
                <div className="h-3 w-24 rounded bg-slate-100" />
              </div>

              <div className="h-4 w-20 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading &&
        !error &&
        filteredPositions.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <BriefcaseBusiness className="h-7 w-7 text-slate-400" />
            </div>

            <h3 className="mt-3 text-base font-bold text-slate-900">
              {positions.length === 0
                ? "No Positions Yet"
                : "No Positions Match Your Search"}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {positions.length === 0
                ? "No job positions are available yet."
                : "Try adjusting your search or filters."}
            </p>

            {positions.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="mt-4 text-slate-700"
              >
                Reset Filters
              </Button>
            )}
          </div>
        )}

      {/* POSITION TABLE */}
      {!loading &&
        !error &&
        filteredPositions.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">
                      Position / Company
                    </th>
                    <th className="px-4 py-3.5">
                      Work Type
                    </th>
                    <th className="px-4 py-3.5">
                      Location
                    </th>
                    <th className="px-4 py-3.5">
                      Intern Status
                    </th>
                    <th className="px-4 py-3.5">
                      Salary Range
                    </th>
                    <th className="px-4 py-3.5">
                      Deadline
                    </th>
                    <th className="px-4 py-3.5">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredPositions.map((position) => {
                    const view = position as PositionView;

                    const internStatus =
                      view.internStatus ??
                      view.intern_status;

                    return (
                      <tr
                        key={position.id}
                        className="transition-colors hover:bg-slate-50"
                      >
                        {/* POSITION & COMPANY */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                              <BriefcaseBusiness className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                              <div className="font-semibold text-slate-900">
                                {position.title}
                              </div>

                              <div className="mt-1 text-[11px] text-slate-500">
                                {position.companyName ||
                                  `Company ID: ${position.companyId}`}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* WORK TYPE */}
                        <td className="px-4 py-4">
                          <Badge variant="info">
                            {position.type || "-"}
                          </Badge>
                        </td>

                        {/* LOCATION */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-xs">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                            <span>
                              {position.location || "-"}
                            </span>
                          </div>
                        </td>

                        {/* INTERN STATUS */}
                        <td className="px-4 py-4">
                          {internStatus ? (
                            <Badge
                              variant={
                                internStatus === "Paid"
                                  ? "success"
                                  : "warning"
                              }
                            >
                              {internStatus}
                            </Badge>
                          ) : (
                            <span className="text-xs text-slate-400">
                              -
                            </span>
                          )}
                        </td>

                        {/* SALARY RANGE */}
                        <td className="px-4 py-4 text-xs">
                          {position.salaryRange || "-"}
                        </td>

                        {/* DEADLINE */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5 text-xs">
                            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                            {formatDeadline(position.deadline)}
                          </div>
                        </td>

                        {/* POSITION STATUS */}
                        <td className="px-4 py-4">
                          <Badge
                            variant={statusVariant(position.status)}
                          >
                            {position.status}
                          </Badge>
                        </td>

                        {/* ACTION BUTTONS */}
                        <td className="px-5 py-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {/* EDIT */}
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenEdit(position)
                              }
                              title="Edit Position"
                              aria-label={`Edit ${position.title}`}
                              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-teal-700"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            {/* DELETE */}
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenDelete(position)
                              }
                              title="Delete Position"
                              aria-label={`Delete ${position.title}`}
                              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 text-xs text-slate-500">
              <span>
                Showing{" "}
                <strong className="text-slate-700">
                  {filteredPositions.length}
                </strong>{" "}
                of{" "}
                <strong className="text-slate-700">
                  {positions.length}
                </strong>{" "}
                positions
              </span>

              <button
                type="button"
                onClick={resetFilters}
                className="text-teal-700 hover:underline"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}

      {/* MODAL ADD & EDIT POSITION */}
      <PositionFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSavePosition}
        initialData={editingPosition}
        companies={companies}
      />

      {/* MODAL DELETE POSITION */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        itemName={deletingPosition?.title || "Position"}
        loading={false}
      />
    </div>
  );
}