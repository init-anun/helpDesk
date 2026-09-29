"use client";

import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";

import PatientForm, {
  PatientFormData,
} from "@/components/patients/PatientForm";

interface EditPatientPageProps {
  params: {
    id: string;
  };
}

const patient: PatientFormData = {
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

export default function EditPatientPage({
  params,
}: EditPatientPageProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 lg:p-8">

        {/* Header */}
        <div className="mb-7">
          <Link
            href={`/patients/${params.id}`}
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Patient
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Pencil className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Edit Patient
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                Update patient information
              </p>
            </div>
          </div>
        </div>

        <PatientForm
          mode="edit"
          initialData={patient}
        />

      </div>
    </div>
  );
}