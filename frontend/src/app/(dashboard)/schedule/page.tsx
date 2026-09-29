"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Plus } from "lucide-react";

import {
  DataTable,
  DataTableSearch,
  DataTablePagination,
} from "@/components/data-table";

import type { DataTableColumn } from "@/components/data-table";

interface Schedule {
  id: number;
  appointmentId: string;
  patientName: string;
  patientId: string;
  therapistName: string;
  date: string;
  time: string;
  type: "Initial Consultation" | "Follow-up" | "Therapy Session";
  status: "Scheduled" | "Completed" | "Cancelled" | "No Show";
}

const schedules: Schedule[] = [
  {
    id: 1,
    appointmentId: "APT-1001",
    patientName: "John Doe",
    patientId: "PT-1001",
    therapistName: "Dr. Sarah Wilson",
    date: "2026-09-29",
    time: "09:00 AM",
    type: "Initial Consultation",
    status: "Scheduled",
  },
  {
    id: 2,
    appointmentId: "APT-1002",
    patientName: "Sarah Wilson",
    patientId: "PT-1002",
    therapistName: "Dr. Michael Brown",
    date: "2026-09-29",
    time: "10:00 AM",
    type: "Therapy Session",
    status: "Scheduled",
  },
  {
    id: 3,
    appointmentId: "APT-1003",
    patientName: "Michael Brown",
    patientId: "PT-1003",
    therapistName: "Dr. Emily Johnson",
    date: "2026-09-29",
    time: "11:30 AM",
    type: "Follow-up",
    status: "Completed",
  },
  {
    id: 4,
    appointmentId: "APT-1004",
    patientName: "Emily Johnson",
    patientId: "PT-1004",
    therapistName: "Dr. David Smith",
    date: "2026-09-29",
    time: "01:00 PM",
    type: "Therapy Session",
    status: "Scheduled",
  },
  {
    id: 5,
    appointmentId: "APT-1005",
    patientName: "David Smith",
    patientId: "PT-1005",
    therapistName: "Dr. Sophia Miller",
    date: "2026-09-29",
    time: "02:30 PM",
    type: "Follow-up",
    status: "Scheduled",
  },
  {
    id: 6,
    appointmentId: "APT-1006",
    patientName: "Sophia Miller",
    patientId: "PT-1006",
    therapistName: "Dr. Robert Taylor",
    date: "2026-09-30",
    time: "09:30 AM",
    type: "Therapy Session",
    status: "Scheduled",
  },
  {
    id: 7,
    appointmentId: "APT-1007",
    patientName: "Robert Taylor",
    patientId: "PT-1007",
    therapistName: "Dr. Olivia Anderson",
    date: "2026-09-30",
    time: "11:00 AM",
    type: "Initial Consultation",
    status: "Cancelled",
  },
  {
    id: 8,
    appointmentId: "APT-1008",
    patientName: "Olivia Anderson",
    patientId: "PT-1008",
    therapistName: "Dr. James Thomas",
    date: "2026-09-30",
    time: "01:30 PM",
    type: "Therapy Session",
    status: "Scheduled",
  },
  {
    id: 9,
    appointmentId: "APT-1009",
    patientName: "James Thomas",
    patientId: "PT-1009",
    therapistName: "Dr. Sarah Wilson",
    date: "2026-10-01",
    time: "10:30 AM",
    type: "Follow-up",
    status: "Completed",
  },
  {
    id: 10,
    appointmentId: "APT-1010",
    patientName: "Emma Martinez",
    patientId: "PT-1010",
    therapistName: "Dr. Michael Brown",
    date: "2026-10-01",
    time: "03:00 PM",
    type: "Therapy Session",
    status: "No Show",
  },
];

const PAGE_SIZE = 5;

export default function SchedulePage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSchedules = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return schedules;
    }

    return schedules.filter((schedule) =>
      [
        schedule.appointmentId,
        schedule.patientName,
        schedule.patientId,
        schedule.therapistName,
        schedule.date,
        schedule.time,
        schedule.type,
        schedule.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [search]);

  const totalPages = Math.ceil(
    filteredSchedules.length / PAGE_SIZE
  );

  const paginatedSchedules = filteredSchedules.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleView = (schedule: Schedule) => {
    console.log("View:", schedule);
  };

  const handleEdit = (schedule: Schedule) => {
    console.log("Edit:", schedule);
  };

  const handleDelete = (schedule: Schedule) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete appointment ${schedule.appointmentId}?`
    );

    if (!confirmed) return;

    console.log("Delete:", schedule);
  };

  const handleAddSchedule = () => {
    console.log("Add appointment");
  };

  const columns: DataTableColumn<Schedule>[] = [
    {
      key: "appointmentId",
      header: "Appointment ID",
      render: (schedule) => (
        <span className="font-medium text-slate-700">
          {schedule.appointmentId}
        </span>
      ),
    },
    {
      key: "patientName",
      header: "Patient",
      render: (schedule) => (
        <div>
          <p className="font-medium text-slate-800">
            {schedule.patientName}
          </p>

          <p className="text-xs text-slate-400">
            {schedule.patientId}
          </p>
        </div>
      ),
    },
    {
      key: "therapistName",
      header: "Therapist",
    },
    {
      key: "date",
      header: "Date",
    },
    {
      key: "time",
      header: "Time",
      render: (schedule) => (
        <span className="font-medium text-slate-600">
          {schedule.time}
        </span>
      ),
    },
    {
      key: "type",
      header: "Appointment Type",
    },
    {
      key: "status",
      header: "Status",
      render: (schedule) => {
        const statusClass =
          schedule.status === "Scheduled"
            ? "bg-blue-50 text-blue-600"
            : schedule.status === "Completed"
            ? "bg-emerald-50 text-emerald-600"
            : schedule.status === "Cancelled"
            ? "bg-red-50 text-red-600"
            : "bg-amber-50 text-amber-600";

        return (
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
          >
            {schedule.status}
          </span>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 lg:p-8">

        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <CalendarDays className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Schedule
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                Manage patient appointments and schedules
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddSchedule}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Add Appointment
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                All Appointments
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {filteredSchedules.length}{" "}
                {filteredSchedules.length === 1
                  ? "appointment"
                  : "appointments"}{" "}
                found
              </p>
            </div>

            <DataTableSearch
              value={search}
              onChange={handleSearch}
              placeholder="Search appointments..."
            />
          </div>

          <DataTable
            data={paginatedSchedules}
            columns={columns}
            getRowKey={(schedule) => schedule.id}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No appointments found."
          />

          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredSchedules.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}