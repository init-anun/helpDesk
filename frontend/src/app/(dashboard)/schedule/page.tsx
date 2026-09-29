"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DataTable,
  DataTablePagination,
  DataTableSearch,
} from "@/components/data-table";

import type { DataTableColumn } from "@/components/data-table";

import ScheduleGrid from "@/components/schedule/ScheduleGrid";
import SessionStatusBadge from "@/components/schedule/SessionStatusBadge";

import {
  sessions,
  therapists,
} from "@/components/sessions/session-data";

import {
  TherapySession,
} from "@/components/sessions/session-types";

const PAGE_SIZE = 5;

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

export default function SchedulePage() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] =
    useState("2026-09-29");

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  /*
   * Example therapist-off configuration.
   *
   * In production this should come from your therapist
   * availability/schedule API.
   */
  const therapistOffIds = useMemo(() => {
    if (selectedDate === "2026-09-29") {
      return [103];
    }

    return [];
  }, [selectedDate]);

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return sessions;
    }

    return sessions.filter((session) =>
      [
        session.patientName,
        session.patientCode,
        session.therapistName,
        session.therapistCode,
        session.sessionType,
        session.status,
        session.mode,
        session.paymentMethod,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [search]);

  const totalPages = Math.ceil(
    filteredSessions.length / PAGE_SIZE
  );

  const paginatedSessions =
    filteredSessions.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    );

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleOpenSlot = (
    therapist: (typeof therapists)[number],
    time: string
  ) => {
    /*
     * Open the create page with preselected
     * therapist/date/time.
     */
    router.push(
      `/schedule/create?therapistId=${therapist.id}&date=${selectedDate}&time=${time}`
    );
  };

  const handleBookedSlot = (
    session: TherapySession
  ) => {
    router.push(`/schedule/${session.id}`);
  };

  const handleView = (session: TherapySession) => {
    router.push(`/schedule/${session.id}`);
  };

  const handleEdit = (session: TherapySession) => {
    router.push(`/schedule/${session.id}/edit`);
  };

  const handleDelete = (session: TherapySession) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this session for ${session.patientName}?`
    );

    if (!confirmed) {
      return;
    }

    console.log("Delete session:", session);
  };

  const columns: DataTableColumn<TherapySession>[] = [
    {
      key: "patientName",
      header: "Patient",
      render: (session) => (
        <div>
          <p className="font-medium text-slate-800">
            {session.patientName}
          </p>

          <p className="text-xs text-slate-400">
            {session.patientCode}
          </p>
        </div>
      ),
    },

    {
      key: "therapistName",
      header: "Therapist",
      render: (session) => (
        <div>
          <p className="font-medium text-slate-700">
            {session.therapistName}
          </p>

          <p className="text-xs text-slate-400">
            {session.therapistCode}
          </p>
        </div>
      ),
    },

    {
      key: "sessionDate",
      header: "Date & Time",
      render: (session) => {
        const date = new Date(
          session.sessionDate
        );

        return (
          <div>
            <p className="font-medium text-slate-700">
              {date.toLocaleDateString()}
            </p>

            <p className="text-xs text-slate-400">
              {date.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
        );
      },
    },

    {
      key: "sessionType",
      header: "Type",
      render: (session) =>
        formatSessionType(session.sessionType),
    },

    {
      key: "mode",
      header: "Mode",
      render: (session) =>
        formatSessionType(session.mode),
    },

    {
      key: "status",
      header: "Status",
      render: (session) => (
        <SessionStatusBadge
          status={session.status}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 lg:p-8">

        {/* Page header */}
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <CalendarDays className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Sessions
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                Schedule and manage therapy sessions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/schedule/create")
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Session
          </button>
        </div>

        {/* Calendar */}
        <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Therapist Availability
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Select a date and book an available therapist slot
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-600">
                Date
              </label>

              <input
                type="date"
                value={selectedDate}
                onChange={(event) =>
                  setSelectedDate(event.target.value)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-5 border-b border-slate-200 px-5 py-3">

            <LegendItem
              className="bg-white"
              border
              label="Open"
            />

            <LegendItem
              className="bg-blue-50"
              label="Booked"
            />

            <LegendItem
              className="bg-slate-100"
              label="Therapist Off"
            />

          </div>

          <ScheduleGrid
            date={selectedDate}
            therapists={therapists}
            sessions={sessions}
            timeSlots={TIME_SLOTS}
            offTherapistIds={therapistOffIds}
            onOpenSlot={handleOpenSlot}
            onBookedSlot={handleBookedSlot}
          />
        </div>

        {/* Session Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                All Sessions
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {filteredSessions.length}{" "}
                {filteredSessions.length === 1
                  ? "session"
                  : "sessions"}{" "}
                found
              </p>
            </div>

            <DataTableSearch
              value={search}
              onChange={handleSearch}
              placeholder="Search sessions..."
            />

          </div>

          <DataTable
            data={paginatedSessions}
            columns={columns}
            getRowKey={(session) => session.id}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No sessions found."
          />

          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredSessions.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />

        </div>
      </div>
    </div>
  );
}

function LegendItem({
  label,
  className,
  border = false,
}: {
  label: string;
  className: string;
  border?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-4 w-4 rounded ${
          border ? "border border-slate-300" : ""
        } ${className}`}
      />

      <span className="text-xs text-slate-500">
        {label}
      </span>
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