"use client";

import { CalendarOff } from "lucide-react";

import {
  TherapistOption,
  TherapySession,
} from "@/types/session";

interface ScheduleGridProps {
  date: string;
  therapists: TherapistOption[];
  sessions: TherapySession[];
  timeSlots: string[];
  offTherapistIds?: number[];
  onOpenSlot?: (
    therapist: TherapistOption,
    time: string
  ) => void;
  onBookedSlot?: (session: TherapySession) => void;
}

function getSessionForSlot(
  sessions: TherapySession[],
  therapistId: number,
  date: string,
  time: string
) {
  return sessions.find((session) => {
    if (session.therapistId !== therapistId) {
      return false;
    }

    const sessionDate = session.sessionDate.slice(0, 10);

    if (sessionDate !== date) {
      return false;
    }

    const sessionTime = new Date(
      session.sessionDate
    ).toTimeString().slice(0, 5);

    return sessionTime === time;
  });
}

export default function ScheduleGrid({
  date,
  therapists,
  sessions,
  timeSlots,
  offTherapistIds = [],
  onOpenSlot,
  onBookedSlot,
}: ScheduleGridProps) {
  return (
    <div className="overflow-x-auto">
      <div
        className="grid min-w-[900px]"
        style={{
          gridTemplateColumns: `90px repeat(${therapists.length}, minmax(180px, 1fr))`,
        }}
      >
        {/* Header */}
        <div className="border-b border-r border-slate-200 bg-slate-50 px-3 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Time
        </div>

        {therapists.map((therapist) => (
          <div
            key={therapist.id}
            className="border-b border-r border-slate-200 bg-slate-50 px-4 py-4"
          >
            <p className="text-sm font-semibold text-slate-800">
              {therapist.name}
            </p>

            <p className="mt-0.5 text-xs text-slate-400">
              {therapist.therapistId}
            </p>
          </div>
        ))}

        {/* Rows */}
        {timeSlots.map((time) => (
          <div key={time} className="contents">
            <div className="border-b border-r border-slate-200 bg-slate-50 px-3 py-4 text-xs font-medium text-slate-500">
              {formatTime(time)}
            </div>

            {therapists.map((therapist) => {
              const therapistOff =
                offTherapistIds.includes(therapist.id);

              const session = getSessionForSlot(
                sessions,
                therapist.id,
                date,
                time
              );

              if (therapistOff) {
                return (
                  <div
                    key={`${therapist.id}-${time}`}
                    className="flex min-h-[86px] items-center justify-center border-b border-r border-slate-200 bg-slate-100"
                  >
                    <div className="text-center">
                      <CalendarOff className="mx-auto h-4 w-4 text-slate-400" />

                      <p className="mt-1 text-xs font-medium text-slate-400">
                        Therapist Off
                      </p>
                    </div>
                  </div>
                );
              }

              if (session) {
                return (
                  <button
                    key={`${therapist.id}-${time}`}
                    type="button"
                    onClick={() => onBookedSlot?.(session)}
                    className="min-h-[86px] border-b border-r border-slate-200 bg-blue-50 p-2 text-left transition hover:bg-blue-100"
                  >
                    <div className="rounded-lg border border-blue-100 bg-white p-2.5 shadow-sm">
                      <p className="text-xs font-semibold text-blue-700">
                        {session.patientName}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-500">
                        {formatSessionType(session.sessionType)}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] font-medium text-blue-600">
                          Booked
                        </span>

                        <span className="text-[10px] text-slate-400">
                          {session.durationMinutes} min
                        </span>
                      </div>
                    </div>
                  </button>
                );
              }

              return (
                <button
                  key={`${therapist.id}-${time}`}
                  type="button"
                  onClick={() =>
                    onOpenSlot?.(therapist, time)
                  }
                  className="min-h-[86px] border-b border-r border-slate-200 bg-white p-2 text-left transition hover:bg-emerald-50"
                >
                  <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 text-xs text-slate-400 transition hover:border-emerald-300 hover:text-emerald-600">
                    Open
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatSessionType(type: string) {
  return type
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}