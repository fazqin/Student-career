
import { useEffect, useMemo, useState } from "react";
import { Layers, Table2 } from "lucide-react";
import { getApplications, updateApplication } from "@/services/api";
import { Segmented } from "@/components/ui/Segmented";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { ApplicationKanban } from "@/components/applications/ApplicationKanban";
import { cn } from "@/utils/cn";

export default function Applications() {
  const [view, setView] = useState("list");
  const [apps, setApps] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const data = await getApplications();
        if (alive) setApps(data);
      } catch (e) {
        if (alive) {
          setError(
            e instanceof Error
              ? e.message
              : "Gagal mengambil data lamaran."
          );
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const openEdit = (app: any) => {
    setEditing(app);
    setPriority(app.priority || "Medium");
    setDeadline(
      app.applicationDeadline
        ? String(app.applicationDeadline).slice(0, 10)
        : app.deadline
          ? String(app.deadline).slice(0, 10)
          : ""
    );
    setNotes(app.notes || "");
    setError("");
  };

  const saveEdit = async () => {
    if (!editing) return;

    setSaving(true);
    setError("");

    try {
      await updateApplication(editing.id, {
        priority,
        deadline: deadline || null,
        notes,
      });

      const refreshed = await getApplications();
      setApps(refreshed);
      setEditing(null);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Gagal menyimpan perubahan."
      );
    } finally {
      setSaving(false);
    }
  };

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
            <div className="text-xs text-slate-500">
              Application tracking
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              Your pipeline, made legible.
            </div>
            <div className="mt-2 text-sm text-slate-500">
              Switch between a professional table and a stage-based Kanban view.
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
              {view === "list" ? (
                <Table2 className="h-4 w-4" />
              ) : (
                <Layers className="h-4 w-4" />
              )}
              Mode
            </div>

            <Segmented
              options={options}
              value={view}
              onChange={setView}
            />
          </div>
        </div>
      </div>

      {error && !editing && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div
        className={cn(
          "transition duration-300",
          view === "list"
            ? "opacity-100"
            : "pointer-events-none hidden opacity-0"
        )}
      >
        <ApplicationTable
          applications={apps}
          onEdit={openEdit}
        />
      </div>

      <div
        className={cn(
          "transition duration-300",
          view === "kanban"
            ? "opacity-100"
            : "pointer-events-none hidden opacity-0"
        )}
      >
        <ApplicationKanban
          applications={apps}
          onEdit={openEdit}
        />
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-application-title"
            className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
          >
            <h2
              id="edit-application-title"
              className="text-lg font-semibold text-slate-900"
            >
              Edit application
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-md border p-2"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-md border p-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-md border p-2"
                  rows={4}
                />
              </div>
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setError("");
                }}
                disabled={saving}
                className="rounded-md border px-4 py-2 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveEdit}
                disabled={saving}
                className="rounded-md bg-teal-700 px-4 py-2 text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
