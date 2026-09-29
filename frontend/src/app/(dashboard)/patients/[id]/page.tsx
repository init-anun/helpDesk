"use client";

import Link from "next/link";
import { ArrowLeft, Pencil, User } from "lucide-react";

interface PatientDetails {
  patientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalHistory: string;
  status: string;
}

interface PatientDetailsPageProps {
  params: {
    id: string;
  };
}

const patient: PatientDetails = {
  patientId: "PT-1001",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+977 9812345678",
  gender: "Male",
  dateOfBirth: "1990-04-12",
  bloodGroup: "O+",
  address: "Kathmandu, Nepal",
  emergencyContactName: "Jane Doe",
  emergencyContactPhone: "+977 9823456789",
  medicalHistory: "No significant medical history.",
  status: "Active",
};

export default function PatientDetailsPage({
  params,
}: PatientDetailsPageProps) {
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

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <User className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  {patient.firstName} {patient.lastName}
                </h1>

                <p className="mt-0.5 text-sm text-slate-500">
                  Patient ID: {patient.patientId}
                </p>
              </div>
            </div>

            <Link
              href={`/patients/${params.id}/edit`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <Pencil className="h-4 w-4" />
              Edit Patient
            </Link>

          </div>
        </div>

        {/* Patient Information */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">

            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-sm font-semibold text-slate-800">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 px-6 py-6 sm:grid-cols-2">

              <InfoItem
                label="First Name"
                value={patient.firstName}
              />

              <InfoItem
                label="Last Name"
                value={patient.lastName}
              />

              <InfoItem
                label="Email"
                value={patient.email}
              />

              <InfoItem
                label="Phone"
                value={patient.phone}
              />

              <InfoItem
                label="Gender"
                value={patient.gender}
              />

              <InfoItem
                label="Date of Birth"
                value={patient.dateOfBirth}
              />

              <InfoItem
                label="Blood Group"
                value={patient.bloodGroup}
              />

              <InfoItem
                label="Status"
                value={patient.status}
              />

              <div className="sm:col-span-2">
                <InfoItem
                  label="Address"
                  value={patient.address}
                />
              </div>

            </div>
          </div>

          {/* Emergency Contact */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-sm font-semibold text-slate-800">
                Emergency Contact
              </h2>
            </div>

            <div className="space-y-5 px-6 py-6">

              <InfoItem
                label="Name"
                value={patient.emergencyContactName}
              />

              <InfoItem
                label="Phone"
                value={patient.emergencyContactPhone}
              />

            </div>
          </div>

          {/* Medical History */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-3">

            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-sm font-semibold text-slate-800">
                Medical History
              </h2>
            </div>

            <div className="px-6 py-6">
              <p className="text-sm leading-6 text-slate-600">
                {patient.medicalHistory || "No medical history recorded."}
              </p>
            </div>
          </div>

        </div>
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

      <p className="mt-1 text-sm text-slate-700">
        {value || "-"}
      </p>
    </div>
  );
}