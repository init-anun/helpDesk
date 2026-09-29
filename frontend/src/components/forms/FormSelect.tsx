"use client";

import { SelectHTMLAttributes, ReactNode } from "react";

interface FormSelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  children: ReactNode;
}

export default function FormSelect({
  error = false,
  className = "",
  children,
  ...props
}: FormSelectProps) {
  return (
    <select
      {...props}
      className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-700 outline-none transition focus:ring-2 ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-red-100"
          : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
      } ${className}`}
    >
      {children}
    </select>
  );
}