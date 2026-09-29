"use client";

import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Pencil,
  User,
  UserRound,
} from "lucide-react";

import Link from "next/link";
import { useParams } from "next/navigation";

import SessionStatusBadge from "@/components/schedule/SessionStatusBadge";

import { sessions } from "@/components/sessions/session-data";

export default function SessionDetailsPage() {
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

          <p className="mt-2 text-sm text-slate-500">
            The requested session does not exist.
          </p>
        </div>
      </div>
    );
  }

  const sessionDate = new Date(
    session.sessionDate
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 lg:p-8">

        {/* Header */}
        <div className="mb-7">
          <Link
            href="/schedule"
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sessions
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">
                    Session Details
                  </h1>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Session #{session.id}
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={`/schedule/${session.id}/edit`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Pencil className="h-4 w-4" />
              Edit Session
            </Link>

          </div>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          <SummaryCard
            icon={<User className="h-5 w-5" />}
            label="Patient"
            value={session.patientName}
            secondary={session.patientCode}
          />

          <SummaryCard
            icon={<UserRound className="h-5 w-5" />}
            label="Therapist"
            value={session.therapistName}
            secondary={session.therapistCode}
          />

          <SummaryCard
            icon={<CalendarDays className="h-5 w-5" />}
            label="Date"
            value={sessionDate.toLocaleDateString()}
            secondary={formatSessionType(session.sessionType)}
          />

          <SummaryCard
            icon={<Clock className="h-5 w-5" />}
            label="Time"
            value={sessionDate.toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
            secondary={`${session.durationMinutes} minutes`}
          />

        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Main */}
          <div className="space-y-6 lg:col-span-2">

            <DetailsSection title="Session Information">

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                <InfoItem
                  label="Session Type"
                  value={formatSessionType(
                    session.sessionType
                  )}
                />

                <InfoItem
                  label="Mode"
                  value={formatSessionType(
                    session.mode
                  )}
                />

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Status
                  </p>

                  <div className="mt-2">
                    <SessionStatusBadge
                      status={session.status}
                    />
                  </div>
                </div>

                <InfoItem
                  label="Payment Method"
                  value={formatSessionType(
                    session.paymentMethod
                  )}
                />

              </div>

            </DetailsSection>

            <DetailsSection title="Clinical Information">

              <div className="space-y-6">

                <InfoItem
                  label="Presenting Concerns"
                  value={
                    session.presentingConcerns ||
                    "-"
                  }
                />

                <InfoItem
                  label="Session Goals"
                  value={
                    session.sessionGoals || "-"
                  }
                />

                <InfoItem
                  label="Interventions"
                  value={
                    session.interventions || "-"
                  }
                />

                <InfoItem
                  label="Client Response"
                  value={
                    session.clientResponse || "-"
                  }
                />

                <InfoItem
                  label="Progress Notes"
                  value={
                    session.progressNotes || "-"
                  }
                />

              </div>

            </DetailsSection>

            <DetailsSection title="Additional Notes">

              <div className="space-y-6">

                <InfoItem
                  label="Clinical Notes"
                  value={
                    session.clinicalNotes || "-"
                  }
                />

                <InfoItem
                  label="Risk Assessment"
                  value={
                    session.riskAssessment || "-"
                  }
                />

                <InfoItem
                  label="Recommendations"
                  value={
                    session.recommendations || "-"
                  }
                />

                <InfoItem
                  label="Homework"
                  value={session.homework || "-"}
                />

                <InfoItem
                  label="Therapist Notes"
                  value={
                    session.therapistNotes || "-"
                  }
                />

              </div>

            </DetailsSection>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            <DetailsSection title="Follow-up">

              <div className="space-y-5">

                <InfoItem
                  label="Follow-up Required"
                  value={
                    session.followUpRequired
                      ? "Yes"
                      : "No"
                  }
                />

                {session.followUpRequired && (
                  <InfoItem
                    label="Next Session"
                    value={
                      session.nextSessionDate
                        ? new Date(
                            session.nextSessionDate
                          ).toLocaleDateString()
                        : "-"
                    }
                  />
                )}

              </div>

            </DetailsSection>

            <DetailsSection title="Appointment">

              <div className="space-y-5">

                <InfoItem
                  label="Patient"
                  value={session.patientName}
                />

                <InfoItem
                  label="Therapist"
                  value={session.therapistName}
                />

                <InfoItem
                  label="Date"
                  value={sessionDate.toLocaleDateString()}
                />

                <InfoItem
                  label="Time"
                  value={sessionDate.toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                />

                <InfoItem
                  label="Duration"
                  value={`${session.durationMinutes} minutes`}
                />

              </div>

            </DetailsSection>

          </div>

        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  secondary,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  secondary: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-slate-400">
            {label}
          </p>

          <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
            {value}
          </p>

          <p className="mt-0.5 text-xs text-slate-400">
            {secondary}
          </p>
        </div>

      </div>
    </div>
  );
}

function DetailsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-sm font-semibold text-slate-800">
          {title}
        </h2>
      </div>

      <div className="px-6 py-6">
        {children}
      </div>

    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">
        {value || "-"}
      </p>
    </div>
  );
}

function formatSessionType(type: string) {
  return type
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}