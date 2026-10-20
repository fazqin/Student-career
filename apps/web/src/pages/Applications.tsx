
import { useEffect, useMemo, useState } from "react";
import { Layers, Table2, History } from "lucide-react";
import { getApplications, updateApplication } from "@/services/api";
import { Segmented } from "@/components/ui/Segmented";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { ApplicationKanban } from "@/components/applications/ApplicationKanban";
import { ApplicationHistory } from "@/components/applications/ApplicationHistory";
import { cn } from "@/utils/cn";

export default function Applications() {
  const [mainTab, setMainTab] = useState("applications");
  const [view, setView] = useState("list");
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setFetchError("");
      try {
        const data = await getApplications();
        if (alive) setApps(data);
      } catch (e) {
        if (alive) {
          const msg =
            e instanceof Error ? e.message : "Gagal mengambil data lamaran.";
          setFetchError(msg);
        }
      } finally {
        if (alive) setLoading(false);
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

  const mainTabOptions = useMemo(
    () => [
      { value: "applications", label: "Applications" },
      { value: "history", label: "History" },
    ],
    []
  );

  const viewOptions = useMemo(
    () => [
      { value: "list", label: "List" },
      { value: "kanban", label: "Kanban" },
    ],
    []
  );

  
const handleWithdraw = async (app: any) => {
  if (!app || app.status === "Withdrawn") return;

  const confirmed = window.confirm(
    `Withdraw application for ${
      app.position?.title ?? "this position"
    }? Your application history will be retained.`
  );

  if (!confirmed) return;

  setWithdrawingId(app.id);
  setError("");

  try {
    await updateApplication(app.id, {
      status: "Withdrawn",
    });

    const refreshed = await getApplications();
    setApps(refreshed);
    setEditing(null);
  } catch (e) {
    setError(
      e instanceof Error
        ? e.message
        : "Failed to withdraw application."
    );
  } finally {
    setWithdrawingId(null);
  }
};



  return (
    <div data-ct-light className="space-y-4">
      {/* ── Page header with main tab switcher ─────────────────────────────── */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs text-slate-500">Application tracking</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              {mainTab === "history"
                ? "Your full application history."
                : "Your pipeline, made legible."}
            </div>
            <div className="mt-2 text-sm text-slate-500">
              {mainTab === "history"
                ? "All applications — active, withdrawn, rejected, and completed."
                : "Switch between a professional table and a stage-based Kanban view."}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            {/* Main tab: Applications | History */}
            <Segmented
              options={mainTabOptions}
              value={mainTab}
              onChange={setMainTab}
            />

            {/* Sub-view toggle: only shown in Applications tab */}
            {mainTab === "applications" && (
              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
                  {view === "list" ? (
                    <Table2 className="h-4 w-4" />
                  ) : (
                    <Layers className="h-4 w-4" />
                  )}
                  Mode
                </div>
                <Segmented
                  options={viewOptions}
                  value={view}
                  onChange={setView}
                />
              </div>
            )}

            {mainTab === "history" && (
              <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
                <History className="h-4 w-4" />
                Full record
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Fetch error (non-modal) ─────────────────────────────────────────── */}
      {fetchError && !editing && (
        <p className="text-sm text-red-600">{fetchError}</p>
      )}

      {/* ── Applications tab ───────────────────────────────────────────────── */}
      {mainTab === "applications" && (
        <>
          <div
            className={cn(
              "transition duration-300",
              view === "list"
                ? "opacity-100"
                : "pointer-events-none hidden opacity-0"
            )}
          >
            <ApplicationTable applications={apps} onEdit={openEdit} />
          </div>

          <div
            className={cn(
              "transition duration-300",
              view === "kanban"
                ? "opacity-100"
                : "pointer-events-none hidden opacity-0"
            )}
          >
            <ApplicationKanban applications={apps} onEdit={openEdit} />
          </div>
        </>
      )}

      {/* ── History tab ────────────────────────────────────────────────────── */}
      {mainTab === "history" && (
        <ApplicationHistory
          applications={apps}
          loading={loading}
          error={fetchError}
          onInspect={openEdit}
        />
      )}

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
              {editing.status === "Withdrawn" || editing.status === "Rejected"
                ? "View application"
                : "Edit application"}
            </h2>

            {/* Read-only notice for terminal statuses */}
            {(editing.status === "Withdrawn" || editing.status === "Rejected") && (
              <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
                This application is <span className="font-semibold">{editing.status.toLowerCase()}</span> and cannot be edited.
              </div>
            )}

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

            
            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <button
                type="button"
                onClick={() => handleWithdraw(editing)}
                disabled={
                  saving ||
                  withdrawingId === editing.id ||
                  editing.status === "Withdrawn"
                }
                className="rounded-md border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50"
              >
                {withdrawingId === editing.id
                  ? "Withdrawing..."
                  : editing.status === "Withdrawn"
                    ? "Application Withdrawn"
                    : "Withdraw Application"}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setError("");
                  }}
                  disabled={saving}
                  className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={saving || editing.status === "Withdrawn" || editing.status === "Rejected"}
                  className="rounded-md bg-teal-700 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
