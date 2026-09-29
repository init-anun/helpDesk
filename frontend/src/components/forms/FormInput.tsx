"use client";

import { InputHTMLAttributes } from "react";

interface FormInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export default function FormInput({
  error = false,
  className = "",
  ...props
}: FormInputProps) {
  return (
    <input
      {...props}
      className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
        error
          ? "border-red-300 focus:border-red-500 focus:ring-red-100"
          : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
      } ${className}`}
    />
  );
}