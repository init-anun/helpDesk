"use client";

import { ReactNode } from "react";
import DataTableActions from "./DataTableActions";

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];

  getRowKey: (item: T) => string | number;

  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;

  emptyMessage?: string;
  actionsLabel?: string;
}

export default function DataTable<T>({
  data,
  columns,
  getRowKey,
  onView,
  onEdit,
  onDelete,
  emptyMessage = "No records found.",
  actionsLabel = "Actions",
}: DataTableProps<T>) {
  const hasActions =
    !!onView || !!onEdit || !!onDelete;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 ${
                  column.headerClassName ?? ""
                }`}
              >
                {column.header}
              </th>
            ))}

            {hasActions && (
              <th className="whitespace-nowrap px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                {actionsLabel}
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={
                  columns.length + (hasActions ? 1 : 0)
                }
                className="px-5 py-12 text-center"
              >
                <div className="text-sm font-medium text-slate-500">
                  {emptyMessage}
                </div>
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={getRowKey(item)}
                className="transition hover:bg-slate-50/70"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`whitespace-nowrap px-5 py-4 text-sm text-slate-600 ${
                      column.className ?? ""
                    }`}
                  >
                    {column.render
                      ? column.render(item)
                      : String(
                          item[
                            column.key as keyof T
                          ] ?? ""
                        )}
                  </td>
                ))}

                {hasActions && (
                  <td className="whitespace-nowrap px-5 py-4">
                    <DataTableActions
                      onView={
                        onView
                          ? () => onView(item)
                          : undefined
                      }
                      onEdit={
                        onEdit
                          ? () => onEdit(item)
                          : undefined
                      }
                      onDelete={
                        onDelete
                          ? () => onDelete(item)
                          : undefined
                      }
                    />
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}