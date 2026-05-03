// components/common/DeleteModal.tsx
import { Trash2, Loader2 } from "lucide-react";

interface DeleteModalProps {
  title?: string;
  message?: string;
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({
  title = "Delete",
  message = "This action cannot be undone.",
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6">
        <Trash2 className="mx-auto mb-4 h-10 w-10 text-danger" />
        <h3 className="text-center text-lg font-semibold text-foreground">
          {title}
        </h3>
        <p className="mt-2 text-center text-sm text-muted">{message}</p>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-danger px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}