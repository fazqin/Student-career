import { useEffect, useMemo, useState } from "react";
import { Layers, Table2 } from "lucide-react";
import { getApplications } from "@/services/api";
import { Segmented } from "@/components/ui/Segmented";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { ApplicationKanban } from "@/components/applications/ApplicationKanban";
import { cn } from "@/utils/cn";

export default function Applications() {
  const [view, setView] = useState("list");
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const a = await getApplications();
      if (alive) setApps(a);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const options = useMemo(
    () => [
      { value: "list", label: "List" },
      { value: "kanban", label: "Kanban" },
    ],
    []
  );

  return (
    <div data-ct-light className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs text-slate-500">Application tracking</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              Your pipeline, made legible.
            </div>
            <div className="mt-2 text-sm text-slate-500">
              Switch between a professional table and a stage-based Kanban view.
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
              {view === "list" ? <Table2 className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
              Mode
            </div>
            <Segmented options={options} value={view} onChange={setView} />
          </div>
        </div>
      </div>

      <div
        className={cn(
          "transition duration-300",
          view === "list" ? "opacity-100" : "opacity-0 pointer-events-none h-0 overflow-hidden"
        )}
      >
        <ApplicationTable applications={apps} />
      </div>

      <div
        className={cn(
          "transition duration-300",
          view === "kanban" ? "opacity-100" : "opacity-0 pointer-events-none h-0 overflow-hidden"
        )}
      >
        <ApplicationKanban applications={apps} />
      </div>
    </div>
  );
}
