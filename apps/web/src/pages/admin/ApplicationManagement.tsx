import { Layers, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function ApplicationManagement() {
  return (
    <div data-ct-light className="space-y-5">
      {/* Page Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Modul Staff
          </span>
          <Badge variant="warning" className="text-[10px] font-semibold">
            Segera Hadir
          </Badge>
        </div>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Application Management
        </h2>
        <p className="mt-1 text-xs text-slate-500 max-w-xl">
          Pantau dan kelola berkas pelamar kerja, status review lamaran, dan tahapan seleksi mahasiswa.
        </p>
      </div>

      {/* Blank / Placeholder State */}
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
          <Layers className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900">
          Halaman Application Management
        </h3>
        <p className="mt-1.5 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Modul pemantauan berkas lamaran mahasiswa sedang dipersiapkan. Fitur review resume, filtering tahapan seleksi, dan status lamaran akan tersedia pada rilis modul mendatang.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5 text-teal-600" />
          <span>Placeholder Menu Staff</span>
        </div>
      </div>
    </div>
  );
}
