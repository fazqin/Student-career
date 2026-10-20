
import { useEffect, useState, type FormEvent } from "react";
import { X, BriefcaseBusiness, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

import type {
  Company,
  Position,
  PositionStatus,
} from "@/services/adminApi";

type InternStatus = "Paid" | "Unpaid";

export type PositionFormData = Omit<
  Position,
  "id" | "createdAt" | "updatedAt"
> & {
  internStatus: InternStatus;
};

type FormValues = {
  companyId: string;
  title: string;
  description: string;
  location: string;
  type: string;
  internStatus: InternStatus | "";
  salaryRange: string;
  deadline: string;
  status: PositionStatus;
};

type FormErrors = Partial<
  Record<keyof FormValues, string>
>;

interface PositionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: PositionFormData,
    id?: string | number
  ) => Promise<void>;
  initialData?: Position | null;
  companies: Company[];
}

// Default form
function getInitialValues(
  position?: Position | null
): FormValues {
  const existing = position as
    | (Position & {
        internStatus?: InternStatus;
        intern_status?: InternStatus;
      })
    | null
    | undefined;

  return {
    companyId: position
      ? String(position.companyId)
      : "",
    title: position?.title || "",
    description: position?.description || "",
    location: position?.location || "",
    type: position?.type === "Full-time"
      ? "Fulltime"
      : position?.type || "Internship",
    internStatus:
      existing?.internStatus ||
      existing?.intern_status ||
      "",
    salaryRange: position?.salaryRange || "",
    deadline: position?.deadline?.slice(0, 10) || "",
    status: position?.status || "Draft",
  };
}

export function PositionFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  companies,
}: PositionFormModalProps) {
  const [form, setForm] = useState<FormValues>(
    getInitialValues(initialData)
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(
    null
  );

  const isEditing = Boolean(initialData);

  // Reset form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setForm(getInitialValues(initialData));
      setErrors({});
      setSubmitError(null);
    }
  }, [isOpen, initialData]);

  // Update input
  function updateField<K extends keyof FormValues>(
    field: K,
    value: FormValues[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));

    setSubmitError(null);
  }

  // Validasi form
  function validateForm(): boolean {
    const nextErrors: FormErrors = {};

    if (!form.companyId) {
      nextErrors.companyId = "Please select a company.";
    }

    if (form.title.trim().length < 3) {
      nextErrors.title =
        "Position title must contain at least 3 characters.";
    }

    if (form.description.trim().length < 10) {
      nextErrors.description =
        "Description must contain at least 10 characters.";
    }

    if (!form.location.trim()) {
      nextErrors.location = "Location is required.";
    }

    if (!form.type) {
      nextErrors.type = "Please select work type.";
    }

    if (!form.internStatus) {
      nextErrors.internStatus =
        "Please select Paid or Unpaid.";
    }

    if (
      form.deadline &&
      Number.isNaN(
        new Date(form.deadline + "T00:00:00").getTime()
      )
    ) {
      nextErrors.deadline = "Invalid deadline.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  // Submit form
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateForm() || saving) return;

    const selectedCompany = companies.find(
      (company) =>
        String(company.id) === form.companyId
    );

    const payload: PositionFormData = {
      companyId: form.companyId,
      companyName:
        selectedCompany?.name ||
        initialData?.companyName ||
        "",
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      type: form.type,
      internStatus: form.internStatus as InternStatus,
      salaryRange: form.salaryRange.trim(),
      deadline: form.deadline,
      status: form.status,
      tags: initialData?.tags || [],
    };

    setSaving(true);
    setSubmitError(null);

    try {
      await onSave(payload, initialData?.id);
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to save position. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    if (!saving) onClose();
  }

  if (!isOpen) return null;

  const companyExists = companies.some(
    (company) =>
      String(company.id) === form.companyId
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="position-modal-title"
        className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <BriefcaseBusiness className="h-5 w-5" />
            </div>

            <div>
              <h2
                id="position-modal-title"
                className="text-lg font-bold text-slate-900"
              >
                {isEditing ? "Edit Position" : "Add New Position"}
              </h2>

              <p className="text-xs text-slate-500">
                {isEditing
                  ? "Update position information."
                  : "Create a new career opportunity."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            aria-label="Close form"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="max-h-[65vh] space-y-5 overflow-y-auto px-6 py-5">

            {/* ERROR */}
            {submitError && (
              <div
                role="alert"
                className="flex gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* COMPANY */}
            <div>
              <Label htmlFor="position-company">
                Company <span className="text-rose-500">*</span>
              </Label>

              <select
                id="position-company"
                value={form.companyId}
                onChange={(e) =>
                  updateField("companyId", e.target.value)
                }
                className="focus-ring h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
              >
                <option value="">Select Company</option>

                {initialData && !companyExists && (
                  <option value={String(initialData.companyId)}>
                    {initialData.companyName ||
                      `Company ${initialData.companyId}`}
                  </option>
                )}

                {companies.map((company) => (
                  <option
                    key={company.id}
                    value={String(company.id)}
                  >
                    {company.name}
                  </option>
                ))}
              </select>

              {errors.companyId && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.companyId}
                </p>
              )}

              {companies.length === 0 && (
                <p className="mt-1 text-xs text-amber-700">
                  No companies available. Add a company first.
                </p>
              )}
            </div>

            {/* POSITION TITLE */}
            <div>
              <Label htmlFor="position-title">
                Position Title <span className="text-rose-500">*</span>
              </Label>

              <Input
                id="position-title"
                value={form.title}
                maxLength={120}
                onChange={(e) =>
                  updateField("title", e.target.value)
                }
                placeholder="e.g. Software Engineer Intern"
              />

              {errors.title && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.title}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <Label htmlFor="position-description">
                Description <span className="text-rose-500">*</span>
              </Label>

              <textarea
                id="position-description"
                rows={4}
                value={form.description}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
                placeholder="Describe the position and responsibilities..."
                className="focus-ring w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400"
              />

              {errors.description && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* LOCATION & WORK TYPE */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="position-location">
                  Location <span className="text-rose-500">*</span>
                </Label>

                <Input
                  id="position-location"
                  value={form.location}
                  onChange={(e) =>
                    updateField("location", e.target.value)
                  }
                  placeholder="e.g. Jakarta, Indonesia"
                />

                {errors.location && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.location}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="position-work-type">
                  Work Type <span className="text-rose-500">*</span>
                </Label>

                <select
                  id="position-work-type"
                  value={form.type}
                  onChange={(e) =>
                    updateField("type", e.target.value)
                  }
                  className="focus-ring h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
                >
                  <option value="Internship">Internship</option>
                  <option value="Fulltime">Fulltime</option>
                </select>
              </div>
            </div>

            {/* INTERN STATUS & SALARY */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="position-intern-status">
                  Intern Status <span className="text-rose-500">*</span>
                </Label>

                <select
                  id="position-intern-status"
                  value={form.internStatus}
                  onChange={(e) =>
                    updateField(
                      "internStatus",
                      e.target.value as InternStatus | ""
                    )
                  }
                  className="focus-ring h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
                >
                  <option value="">Select Status</option>
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>

                {errors.internStatus && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.internStatus}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="position-salary">
                  Salary Range
                </Label>

                <Input
                  id="position-salary"
                  value={form.salaryRange}
                  onChange={(e) =>
                    updateField("salaryRange", e.target.value)
                  }
                  placeholder="e.g. Rp2.000.000 - Rp4.000.000"
                />
              </div>
            </div>

            {/* DEADLINE & LISTING STATUS */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="position-deadline">
                  Application Deadline
                </Label>

                <Input
                  id="position-deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(e) =>
                    updateField("deadline", e.target.value)
                  }
                />

                {errors.deadline && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.deadline}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="position-status">
                  Listing Status
                </Label>

                <select
                  id="position-status"
                  value={form.status}
                  onChange={(e) =>
                    updateField(
                      "status",
                      e.target.value as PositionStatus
                    )
                  }
                  className="focus-ring h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Closed">Closed</option>
                </select>

                <p className="mt-1 text-[11px] text-slate-400">
                  UI-only until backend support is agreed.
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={handleClose}
              disabled={saving}
              className="text-slate-600"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="secondary"
              size="md"
              disabled={saving || (!isEditing && companies.length === 0)}
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Position"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}