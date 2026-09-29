"use client";

import { useMemo, useState } from "react";
import { Plus, Stethoscope } from "lucide-react";

import {
  DataTable,
  DataTableSearch,
  DataTablePagination,
} from "@/components/data-table";

import type { DataTableColumn } from "@/components/data-table";

interface Therapist {
  id: number;
  therapistId: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: string;
  status: "Active" | "Inactive";
}

const therapists: Therapist[] = [
  {
    id: 1,
    therapistId: "TH-1001",
    name: "Dr. Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "+977 9812345678",
    specialization: "Physiotherapy",
    experience: "8 Years",
    status: "Active",
  },
  {
    id: 2,
    therapistId: "TH-1002",
    name: "Dr. Michael Brown",
    email: "michael.brown@example.com",
    phone: "+977 9823456789",
    specialization: "Occupational Therapy",
    experience: "6 Years",
    status: "Active",
  },
  {
    id: 3,
    therapistId: "TH-1003",
    name: "Dr. Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "+977 9834567890",
    specialization: "Speech Therapy",
    experience: "5 Years",
    status: "Inactive",
  },
  {
    id: 4,
    therapistId: "TH-1004",
    name: "Dr. David Smith",
    email: "david.smith@example.com",
    phone: "+977 9845678901",
    specialization: "Physical Therapy",
    experience: "10 Years",
    status: "Active",
  },
  {
    id: 5,
    therapistId: "TH-1005",
    name: "Dr. Sophia Miller",
    email: "sophia.miller@example.com",
    phone: "+977 9856789012",
    specialization: "Mental Health Therapy",
    experience: "7 Years",
    status: "Active",
  },
  {
    id: 6,
    therapistId: "TH-1006",
    name: "Dr. Robert Taylor",
    email: "robert.taylor@example.com",
    phone: "+977 9867890123",
    specialization: "Physiotherapy",
    experience: "12 Years",
    status: "Active",
  },
  {
    id: 7,
    therapistId: "TH-1007",
    name: "Dr. Olivia Anderson",
    email: "olivia.anderson@example.com",
    phone: "+977 9878901234",
    specialization: "Occupational Therapy",
    experience: "4 Years",
    status: "Inactive",
  },
  {
    id: 8,
    therapistId: "TH-1008",
    name: "Dr. James Thomas",
    email: "james.thomas@example.com",
    phone: "+977 9889012345",
    specialization: "Speech Therapy",
    experience: "9 Years",
    status: "Active",
  },
];

const PAGE_SIZE = 5;

export default function TherapistsPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTherapists = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return therapists;
    }

    return therapists.filter((therapist) =>
      [
        therapist.name,
        therapist.therapistId,
        therapist.email,
        therapist.phone,
        therapist.specialization,
        therapist.experience,
        therapist.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [search]);

  const totalPages = Math.ceil(
    filteredTherapists.length / PAGE_SIZE
  );

  const paginatedTherapists = filteredTherapists.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleView = (therapist: Therapist) => {
    console.log("View:", therapist);
  };

  const handleEdit = (therapist: Therapist) => {
    console.log("Edit:", therapist);
  };

  const handleDelete = (therapist: Therapist) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${therapist.name}?`
    );

    if (!confirmed) return;

    console.log("Delete:", therapist);
  };

  const handleAddTherapist = () => {
    console.log("Add therapist");
  };

  const columns: DataTableColumn<Therapist>[] = [
    {
      key: "name",
      header: "Therapist",
      render: (therapist) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
            {therapist.name
              .replace("Dr. ", "")
              .split(" ")
              .map((name) => name[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div>
            <p className="font-medium text-slate-800">
              {therapist.name}
            </p>

            <p className="text-xs text-slate-400">
              {therapist.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "therapistId",
      header: "Therapist ID",
      render: (therapist) => (
        <span className="font-medium text-slate-600">
          {therapist.therapistId}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Contact",
    },
    {
      key: "specialization",
      header: "Specialization",
    },
    {
      key: "experience",
      header: "Experience",
    },
    {
      key: "status",
      header: "Status",
      render: (therapist) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            therapist.status === "Active"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {therapist.status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 lg:p-8">

        {/* Header */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Stethoscope className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Therapists
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                Manage and view all registered therapists
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddTherapist}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Add Therapist
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                All Therapists
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {filteredTherapists.length}{" "}
                {filteredTherapists.length === 1
                  ? "therapist"
                  : "therapists"}{" "}
                found
              </p>
            </div>

            <DataTableSearch
              value={search}
              onChange={handleSearch}
              placeholder="Search therapists..."
            />
          </div>

          <DataTable
            data={paginatedTherapists}
            columns={columns}
            getRowKey={(therapist) => therapist.id}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No therapists found."
          />

          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredTherapists.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}