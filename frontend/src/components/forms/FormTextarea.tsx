"use client";

import { TextareaHTMLAttributes } from "react";

interface FormTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export default function FormTextarea({
  error = false,
  className = "",
  ...props
}: FormTextareaProps) {
  return (
    <textarea
      {...props}
      className={`min-h-[100px] w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-red-100"
          : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
      } ${className}`}
    />
  );
}