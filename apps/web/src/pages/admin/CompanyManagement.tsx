import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  MapPin,
  Filter,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Globe,
  Users,
} from "lucide-react";
import {
  getAdminCompanies,
  createAdminCompany,
  updateAdminCompany,
  deleteAdminCompany,
  type Company,
} from "@/services/adminApi";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { CompanyFormModal } from "@/components/admin/CompanyFormModal";
import { DeleteConfirmModal } from "@/components/admin/DeleteConfirmModal";

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  // Notification feedback
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingCompany, setDeletingCompany] = useState<Company | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch companies data
  async function loadCompanies() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminCompanies();
      setCompanies(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat daftar perusahaan. Silakan periksa koneksi backend atau coba kembali."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  // Filter industry options dynamically
  const industryList = useMemo(() => {
    const set = new Set<string>();
    companies.forEach((c) => {
      if (c.industry) set.add(c.industry);
    });
    return ["All", ...Array.from(set)];
  }, [companies]);

  // Filtered companies based on search and industry dropdown
  const filteredCompanies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return companies.filter((c) => {
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.industry && c.industry.toLowerCase().includes(q)) ||
        (c.location && c.location.toLowerCase().includes(q)) ||
        (c.description && c.description.toLowerCase().includes(q));

      const matchesIndustry =
        selectedIndustry === "All" || c.industry === selectedIndustry;

      return matchesSearch && matchesIndustry;
    });
  }, [companies, searchQuery, selectedIndustry]);

  // Handle open Add Modal
  function handleOpenAdd() {
    setEditingCompany(null);
    setIsFormOpen(true);
  }

  // Handle open Edit Modal
  function handleOpenEdit(company: Company) {
    setEditingCompany(company);
    setIsFormOpen(true);
  }

  // Handle open Delete Modal
  function handleOpenDelete(company: Company) {
    setDeletingCompany(company);
    setIsDeleteOpen(true);
  }

  // Save Company (Add or Edit)
  async function handleSaveCompany(
    data: Omit<Company, "id" | "createdAt" | "updatedAt">,
    id?: string | number
  ) {
    if (id) {
      // Update
      const updated = await updateAdminCompany(id, data);
      setCompanies((prev) =>
        prev.map((c) => (String(c.id) === String(id) ? { ...c, ...updated } : c))
      );
      setFeedback({
        type: "success",
        message: `Perusahaan "${updated.name}" berhasil diperbarui.`,
      });
    } else {
      // Create
      const created = await createAdminCompany(data);
      setCompanies((prev) => [created, ...prev]);
      setFeedback({
        type: "success",
        message: `Perusahaan "${created.name}" berhasil ditambahkan ke direktori mitra.`,
      });
    }

    // Auto-dismiss feedback after 4 seconds
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  }

  // Confirm Delete Company
  async function handleConfirmDelete() {
    if (!deletingCompany) return;
    setDeleteLoading(true);
    try {
      await deleteAdminCompany(deletingCompany.id);
      setCompanies((prev) =>
        prev.filter((c) => String(c.id) !== String(deletingCompany.id))
      );
      setFeedback({
        type: "success",
        message: `Perusahaan "${deletingCompany.name}" berhasil dihapus.`,
      });
      setIsDeleteOpen(false);
      setDeletingCompany(null);
    } catch (err) {
      setFeedback({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Gagal menghapus perusahaan. Silakan coba kembali.",
      });
    } finally {
      setDeleteLoading(false);
      setTimeout(() => {
        setFeedback(null);
      }, 4000);
    }
  }

  return (
    <div data-ct-light className="space-y-5">
      {/* Page Header Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Direktori Mitra Staff
              </span>

              <Badge variant="info" className="text-[10px] font-semibold">
                {companies.length} Mitra Terdaftar
              </Badge>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Company Management
            </h2>
            <p className="mt-1 text-xs text-slate-500 max-w-xl">
              Kelola data perusahaan mitra industri, kontak resmi, dan integrasi lowongan kerja
              mahasiswa CareerTrack.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="secondary"
              size="md"
              onClick={handleOpenAdd}
              className="gap-2 font-semibold shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Perusahaan</span>
            </Button>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-5 flex flex-col gap-3 pt-4 border-t border-slate-100 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama perusahaan, industri, atau lokasi..."
              className="pl-9 bg-slate-50 text-xs sm:text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-500">Industri:</span>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="focus-ring h-10 rounded-lg border border-slate-300 bg-white px-3 text-xs text-slate-700 hover:border-slate-400"
            >
              {industryList.map((ind) => (
                <option key={ind} value={ind}>
                  {ind === "All" ? "Semua Industri" : ind}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Success / Error Feedback Banner */}
      {feedback && (
        <div
          role="status"
          className={`flex items-center justify-between gap-3 rounded-xl border p-3.5 text-xs animate-in fade-in duration-200 ${
            feedback.type === "success"
              ? "border-teal-300 bg-teal-50 text-teal-900"
              : "border-rose-300 bg-rose-50 text-rose-900"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            )}
            <span className="font-medium">{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-500 hover:text-slate-800 text-xs font-semibold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* =========================================================================
       * 1. ERROR STATE
       * ========================================================================= */}
      {error && !loading && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-6 text-center text-rose-900 shadow-sm">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-500 mb-2" />
          <h3 className="text-sm font-bold text-rose-950">Gagal Mengambil Data Perusahaan</h3>
          <p className="mt-1 text-xs text-rose-700 max-w-md mx-auto">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadCompanies}
            className="mt-4 gap-1.5 border-rose-300 bg-white text-rose-800 hover:bg-rose-100"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Coba Muat Ulang
          </Button>
        </div>
      )}

      {/* =========================================================================
       * 2. LOADING STATE (Skeleton Rows)
       * ========================================================================= */}
      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
            <div className="h-4 w-20 rounded bg-slate-200 animate-pulse" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 p-3 rounded-lg border border-slate-100 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-slate-200 shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 w-40 rounded bg-slate-200" />
                  <div className="h-3 w-24 rounded bg-slate-100" />
                </div>
              </div>
              <div className="hidden sm:block h-4 w-28 rounded bg-slate-100" />
              <div className="hidden md:block h-4 w-32 rounded bg-slate-100" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-slate-200" />
                <div className="h-8 w-8 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
       * 3. EMPTY STATE
       * ========================================================================= */}
      {!loading && !error && filteredCompanies.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Building2 className="h-7 w-7" />
          </div>
          {companies.length === 0 ? (
            <>
              <h3 className="mt-3 text-base font-bold text-slate-900">
                Belum Ada Perusahaan Mitra
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Mulai bangun kemitraan industri dengan mendaftarkan profil perusahaan pertama ke
                sistem CareerTrack.
              </p>
              <Button
                variant="secondary"
                size="md"
                onClick={handleOpenAdd}
                className="mt-4 gap-2"
              >
                <Plus className="h-4 w-4" />
                Tambah Perusahaan Pertama
              </Button>
            </>
          ) : (
            <>
              <h3 className="mt-3 text-base font-bold text-slate-900">
                Tidak Ada Perusahaan yang Cocok
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Tidak ditemukan perusahaan yang cocok dengan kata kunci atau filter yang Anda pilih.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedIndustry("All");
                }}
                className="mt-4 border-slate-300 text-slate-700"
              >
                Reset Filter Pencarian
              </Button>
            </>
          )}
        </div>
      )}

      {/* =========================================================================
       * 4. DATA TABLE / LIST
       * ========================================================================= */}
      {!loading && !error && filteredCompanies.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3.5">
                    Perusahaan
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Industri & Skala
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    Lokasi Kantor
                  </th>
                  <th scope="col" className="px-4 py-3.5 hidden lg:table-cell">
                    Deskripsi
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCompanies.map((company) => {
                  const initial = company.name ? company.name.charAt(0).toUpperCase() : "C";
                  return (
                    <tr
                      key={company.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Company Name & Brand */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white font-bold text-sm shadow-sm"
                            style={{
                              backgroundColor: company.brandColor || "#14b8a6",
                            }}
                          >
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 truncate">
                              {company.name}
                            </div>
                            {company.website ? (
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-teal-700 hover:text-teal-900 hover:underline"
                              >
                                <span>{company.website.replace(/^https?:\/\//, "")}</span>
                                <ExternalLink className="h-2.5 w-2.5" />
                              </a>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                Tanpa website
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Industry & Size */}
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <Badge variant="info" className="text-[10px]">
                            {company.industry || "General"}
                          </Badge>
                          {company.size && (
                            <div className="flex items-center gap-1 text-[11px] text-slate-500">
                              <Users className="h-3 w-3 text-slate-400" />
                              <span>{company.size}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                          <span className="truncate max-w-[180px]">
                            {company.location || "-"}
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <p className="line-clamp-2 text-xs text-slate-500 max-w-sm leading-relaxed">
                          {company.description || "Tidak ada deskripsi tersedia."}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(company)}
                            title="Edit Perusahaan"
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-teal-700 transition"
                            aria-label={`Edit ${company.name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(company)}
                            title="Hapus Perusahaan"
                            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                            aria-label={`Hapus ${company.name}`}
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

          {/* Table Footer Summary */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 text-xs text-slate-500">
            <div>
              Menampilkan <span className="font-semibold text-slate-700">{filteredCompanies.length}</span> dari{" "}
              <span className="font-semibold text-slate-700">{companies.length}</span> perusahaan
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[11px] text-teal-700 hover:underline"
              >
                Hapus pencarian
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add & Edit Company Form */}
      <CompanyFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveCompany}
        initialData={editingCompany}
      />

      {/* Modal: Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingCompany(null);
        }}
        onConfirm={handleConfirmDelete}
        itemName={deletingCompany?.name || "Perusahaan"}
        loading={deleteLoading}
      />
    </div>
  );
}
