"use client";

import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import SessionForm from "@/components/sessions/SessionForm";

import {
  patients,
  therapists,
} from "@/components/sessions/session-data";

export default function CreateSessionPage() {
  const searchParams = useSearchParams();

  const therapistId =
    searchParams.get("therapistId") ?? "";

  const date =
    searchParams.get("date") ?? "";

  const time =
    searchParams.get("time") ?? "09:00";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 lg:p-8">

        <div className="mb-7">
          <Link
            href="/schedule"
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sessions
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Add Session
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                Book a new therapy session
              </p>
            </div>
          </div>
        </div>

        <SessionForm
          patients={patients}
          therapists={therapists}
          mode="create"
          initialData={{
            therapistId: therapistId
              ? Number(therapistId)
              : undefined,

            sessionDate:
              date && time
                ? `${date}T${time}:00`
                : undefined,
          }}
        />

      </div>
    </div>
  );
}