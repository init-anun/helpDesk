"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Users,
} from "lucide-react";

import {
  DataTable,
  DataTableSearch,
  DataTablePagination,
} from "@/components/data-table";

import type {
  DataTableColumn,
} from "@/components/data-table";

import { useRouter } from "next/navigation";

interface Patient {
  id: number;
  patientId: string;
  name: string;
  email: string;
  phone: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  status: "Active" | "Inactive";
}

const PAGE_SIZE = 10;

export default function PatientsPage() {
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Fetch patients from backend
   */
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://127.0.0.1:8000/api/patients/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch patients (${response.status})`
          );
        }

        const data = await response.json();

        /*
         * If your FastAPI endpoint returns:
         *
         * [
         *   {
         *     "id": 1,
         *     "patient_id": "PT-1001",
         *     "name": "John Doe",
         *     ...
         *   }
         * ]
         *
         * this converts it into the frontend format.
         *
         * If your backend already returns camelCase,
         * the fallback values handle that as well.
         */
        const patientsData: Patient[] = data.map(
          (patient: any) => ({
            id: patient.id,

            patientId:
              patient.sub_acc_code ?? "",

            name:
              patient.name ??
              `${patient.first_name ?? ""} ${
                patient.last_name ?? ""
              }`.trim(),

            email: patient.email ?? "",

            phone:
              patient.phone ??
              patient.phone_number ??
              "",

            gender: patient.gender ?? "Other",

            dateOfBirth:
              patient.date_of_birth ??
              patient.dateOfBirth ??
              "",

            status: patient.status ?? "Active",
          })
        );

        setPatients(patientsData);
      } catch (err) {
        console.error("Error fetching patients:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load patients."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  /**
   * Search/filter patients
   */
  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return patients;
    }

    return patients.filter((patient) =>
      [
        patient.name,
        patient.patientId,
        patient.email,
        patient.phone,
        patient.gender,
        patient.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [patients, search]);

  /**
   * Reset pagination if search result changes
   */
  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(filteredPatients.length / PAGE_SIZE)
    );

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredPatients.length, currentPage]);

  const totalPages = Math.ceil(
    filteredPatients.length / PAGE_SIZE
  );

  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  /**
   * View patient
   */
  const handleView = (patient: Patient) => {
    router.push(`/patients/${patient.id}`);
  };

  /**
   * Edit patient
   */
  const handleEdit = (patient: Patient) => {
    router.push(`/patients/${patient.id}/edit`);
  };

  /**
   * Add patient
   */
  const handleAddPatient = () => {
    router.push("/patients/create");
  };

  /**
   * Delete patient
   */
  const handleDelete = async (patient: Patient) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${patient.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/patients/${patient.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete patient.");
      }

      // Remove deleted patient from local state
      setPatients((currentPatients) =>
        currentPatients.filter(
          (item) => item.id !== patient.id
        )
      );
    } catch (err) {
      console.error("Error deleting patient:", err);

      window.alert(
        err instanceof Error
          ? err.message
          : "Failed to delete patient."
      );
    }
  };

  /**
   * Table columns
   */
  const columns: DataTableColumn<Patient>[] = [
    {
      key: "name",
      header: "Patient",

      render: (patient) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
            {patient.name
              ? patient.name
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "P"}
          </div>

          <div>
            <p className="font-medium text-slate-800">
              {patient.name || "Unnamed Patient"}
            </p>

            <p className="text-xs text-slate-400">
              {patient.email || "No email"}
            </p>
          </div>
        </div>
      ),
    },

    {
      key: "patientId",
      header: "Patient ID",

      render: (patient) => (
        <span className="font-medium text-slate-600">
          {patient.patientId}
        </span>
      ),
    },

    {
      key: "phone",
      header: "Contact",

      render: (patient) => (
        <span className="text-slate-600">
          {patient.phone || "-"}
        </span>
      ),
    },

    {
      key: "gender",
      header: "Gender",

      render: (patient) => (
        <span className="text-slate-600">
          {patient.gender || "-"}
        </span>
      ),
    },

    {
      key: "dateOfBirth",
      header: "Date of Birth",

      render: (patient) => (
        <span className="text-slate-600">
          {patient.dateOfBirth || "-"}
        </span>
      ),
    },

    {
      key: "status",
      header: "Status",

      render: (patient) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            patient.status === "Active"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {patient.status}
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
              <Users className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Patients
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                Manage and view all registered patients
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddPatient}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Add Patient
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                All Patients
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                {filteredPatients.length}{" "}
                {filteredPatients.length === 1
                  ? "patient"
                  : "patients"}{" "}
                found
              </p>
            </div>

            <DataTableSearch
              value={search}
              onChange={handleSearch}
              placeholder="Search patients..."
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                Loading patients...
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-sm font-medium text-red-600">
                Failed to load patients
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Data table */}
          {!loading && !error && (
            <>
              <DataTable
                data={paginatedPatients}
                columns={columns}
                getRowKey={(patient) => patient.id}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                emptyMessage="No patients found."
              />

              <DataTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredPatients.length}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}