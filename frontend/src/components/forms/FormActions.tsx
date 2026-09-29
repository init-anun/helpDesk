"use client";

import { Loader2 } from "lucide-react";

interface FormActionsProps {
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onCancel: () => void;
}

export default function FormActions({
  submitLabel = "Save",
  cancelLabel = "Cancel",
  loading = false,
  onCancel,
}: FormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {cancelLabel}
      </button>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}

        {loading ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}