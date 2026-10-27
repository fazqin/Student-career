import { useEffect, useMemo, useState } from "react";
import { Filter } from "lucide-react";
import { getPositions } from "@/services/api";
import { Input } from "@/components/ui/Input";
import { Segmented } from "@/components/ui/Segmented";
import { JobCard } from "@/components/jobs/JobCard";
import { Button } from "@/components/ui/Button";

export default function Jobs() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0 });
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    (async () => {
      try {
        const res: any = await getPositions({ query, type, page, limit: 6 });
        if (alive && res) {
          setPositions(res.positions || []);
          setPagination(res.pagination || { totalPages: 1, totalItems: 0 });
        }
      } catch (err) {
        console.error("Failed to load positions:", err);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [query, type, page]);

  // Reset ke halaman 1 jika user melakukan pencarian baru atau ganti filter
  const handleQueryChange = (val: string) => {
    setQuery(val);
    setPage(1);
  };

  const handleTypeChange = (val: string) => {
    setType(val);
    setPage(1);
  };

  const typeOptions = useMemo(
    () => [
      { value: "All", label: "All" },
      { value: "Internship", label: "Internships" },
    ],
    []
  );

  return (
    <div data-ct-light className="space-y-4">
      {/* HEADER & FILTER */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs text-slate-500">Job discovery</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              Find roles worth your time.
            </div>
            <div className="mt-2 text-sm text-slate-500">
              Search across realistic demo roles — designed as a premium UI, ready for REST.
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-[320px]">
              <Input
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search roles, tags, teams…"
                aria-label="Search jobs"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
                <Filter className="h-4 w-4" />
                Filter
              </div>
              <Segmented options={typeOptions} value={type} onChange={handleTypeChange} />
            </div>
          </div>
        </div>
      </div>

      {/* GRID KARTU LOWONGAN */}
      <div className="grid gap-4 lg:grid-cols-2">
        {positions.map((p) => (
          <JobCard key={p.id} position={p} />
        ))}
      </div>

      {/* JIKA TIDAK ADA LOWONGAN */}
      {!loading && positions.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
          No roles match your search.
        </div>
      )}

      {/* KONTROL NAVIGASI PAGINATION DI BAWAH */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 bg-white rounded-lg p-4 shadow-sm mt-6">
          <span className="text-xs text-slate-500">
            Menampilkan halaman <strong>{page}</strong> dari <strong>{pagination.totalPages}</strong> (Total {pagination.totalItems} Lowongan)
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="text-xs"
            >
              &larr; Sebelumnya
            </Button>

            <span className="px-3 py-1 rounded bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
              {page}
            </span>

            <Button
              variant="ghost"
              size="sm"
              disabled={page >= pagination.totalPages || loading}
              onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
              className="text-xs"
            >
              Selanjutnya &rarr;
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
