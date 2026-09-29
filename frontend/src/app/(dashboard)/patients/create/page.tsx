"use client";

import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";

import PatientForm from "@/components/patients/PatientForm";

export default function CreatePatientPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 lg:p-8">

        {/* Header */}
        <div className="mb-7">
          <Link
            href="/patients"
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Patients
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <UserPlus className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Add Patient
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                Create a new patient record
              </p>
            </div>
          </div>
        </div>

        <PatientForm mode="create" />

      </div>
    </div>
  );
}