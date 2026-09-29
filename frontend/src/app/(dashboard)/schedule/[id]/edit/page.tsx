"use client";

import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import SessionForm from "@/components/sessions/SessionForm";

import {
  patients,
  sessions,
  therapists,
} from "@/components/sessions/session-data";

export default function EditSessionPage() {
  const params = useParams();

  const sessionId = Number(params.id);

  const session = sessions.find(
    (item) => item.id === sessionId
  );

  if (!session) {
    return (
      <div className="p-8">
        <Link
          href="/schedule"
          className="inline-flex items-center gap-2 text-sm text-slate-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sessions
        </Link>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-lg font-semibold text-slate-800">
            Session not found
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 lg:p-8">

        <div className="mb-7">
          <Link
            href={`/schedule/${session.id}`}
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Session
          </Link>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Pencil className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Edit Session
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                Update or reschedule this therapy session
              </p>
            </div>

          </div>
        </div>

        <SessionForm
          patients={patients}
          therapists={therapists}
          initialData={session}
          mode="edit"
        />

      </div>
    </div>
  );
}