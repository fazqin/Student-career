import { applicationStages } from "@/data/mockData";
import { ApplicationCard } from "@/components/applications/ApplicationCard";

export function ApplicationKanban({ applications, onEdit }: { applications: any[]; onEdit?: (app: any) => void }) {
  
  const priorityOrder: Record<string, number> = {
  High: 1,
  Medium: 2,
  Low: 3,
};

const byStage = (stage: string) =>
  (applications ?? [])
    .filter((a) => a.stage === stage)
    .sort(
      (a, b) =>
        (priorityOrder[a.priority] ?? 99) -
        (priorityOrder[b.priority] ?? 99)
    );
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
      <div className="flex min-w-0 gap-3 overflow-x-auto p-5">
        {applicationStages.map((stage) => (
          <div
            key={stage}
            className="w-[260px] flex-shrink-0 rounded-lg border border-slate-200 bg-slate-100"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div className="text-xs font-semibold text-slate-800">{stage}</div>
              <div className="text-[11px] font-medium text-slate-500">{byStage(stage).length}</div>
            </div>
            <div className="space-y-2 px-3 pb-3">
              {byStage(stage).map((a) => (
                <ApplicationCard key={a.id} app={a} onEdit={onEdit} />
              ))}
              {byStage(stage).length === 0 && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-400">
                  No items
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 bg-slate-100 px-5 py-4 text-xs text-slate-500">
        Demo view: drag-and-drop can be added later without changing backend entities.
      </div>
    </div>
  );
}
