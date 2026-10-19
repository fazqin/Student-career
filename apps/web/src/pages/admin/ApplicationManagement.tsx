import { Layers, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function ApplicationManagement() {
  return (
    <div data-ct-light className="space-y-5">
      {/* Page Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Admin Module
          </span>
          <Badge variant="warning" className="text-[10px] font-semibold">
            Coming Soon
          </Badge>
        </div>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Application Management
        </h2>
        <p className="mt-1 text-xs text-slate-500 max-w-xl">
          Track student application dossiers, candidate pipeline review stages, and hiring outcomes.
        </p>
      </div>

      {/* Blank / Placeholder State */}
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
          <Layers className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900">
          Application Management Workspace
        </h3>
        <p className="mt-1.5 text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          The student application tracking and screening module is currently under development. Candidate resume screening, pipeline status updates, and stage filtering will be enabled in upcoming releases.
        </p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5 text-teal-600" />
          <span>Admin Workspace Placeholder</span>
        </div>
      </div>
    </div>
  );
}
