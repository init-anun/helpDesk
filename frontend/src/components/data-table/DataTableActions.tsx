"use client";

import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

interface DataTableActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function DataTableActions({
  onView,
  onEdit,
  onDelete,
}: DataTableActionsProps) {
  if (!onView && !onEdit && !onDelete) {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-1">
      {onView && (
        <button
          type="button"
          onClick={onView}
          title="View"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
        >
          <Eye className="h-4 w-4" />
        </button>
      )}

      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          title="Edit"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          title="Delete"
          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}