import { AlertTriangle, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  itemName: string;
  loading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  itemName,
  loading = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Warning Icon & Prompt */}
        <div className="flex items-start gap-3.5 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <div className="rounded-full bg-rose-100 p-2 text-rose-600 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="text-sm text-rose-900 leading-relaxed">
            <p className="font-semibold text-rose-950">
              Delete company <span className="underline font-bold">"{itemName}"</span>?
            </p>
            <p className="mt-1 text-xs text-rose-700">
              This action is permanent and cannot be undone. All positions and job listings associated
              with this company may be affected.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="text-slate-600 hover:text-slate-900"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Deleting...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Trash2 className="h-4 w-4" />
                Delete Company
              </span>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
