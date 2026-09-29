"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import {
  FormActions,
  FormField,
  FormInput,
  FormSection,
  FormSelect,
  FormTextarea,
} from "@/components/forms";

export interface PatientFormData {
  patientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: "Male" | "Female" | "Other" | "";
  dateOfBirth: string;
  bloodGroup: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalHistory: string;
  status: "Active" | "Inactive";
}

interface PatientFormProps {
  initialData?: Partial<PatientFormData>;
  mode?: "create" | "edit";
}

const defaultValues: PatientFormData = {
  patientId: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  bloodGroup: "",
  address: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  medicalHistory: "",
  status: "Active",
};

export default function PatientForm({
  initialData,
  mode = "create",
}: PatientFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<PatientFormData>({
    ...defaultValues,
    ...initialData,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof PatientFormData, string>>
  >({});

  const [loading, setLoading] = useState(false);

  const updateField = <K extends keyof PatientFormData>(
    field: K,
    value: PatientFormData[K]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  const validate = () => {
    const newErrors: Partial<
      Record<keyof PatientFormData, string>
    > = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required.";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
    }

    if (!formData.emergencyContactName.trim()) {
      newErrors.emergencyContactName =
        "Emergency contact name is required.";
    }

    if (!formData.emergencyContactPhone.trim()) {
      newErrors.emergencyContactPhone =
        "Emergency contact phone is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const isCreate = mode === "create";

      // Create:
      // POST /api/patients
      //
      // Edit:
      // PUT /api/patients/{patientId}
      const url = isCreate
        ? "http://127.0.0.1:8000/api/patients/"
        : `http://127.0.0.1:8000/api/patients/${formData.patientId}/`;

      const method = isCreate ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // patientId: formData.patientId || null,
          // firstName: formData.firstName.trim(),
          // lastName: formData.lastName.trim(),
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          bloodGroup: formData.bloodGroup || null,
          address: formData.address.trim() || null,
          emergencyContactName:
            formData.emergencyContactName.trim(),
          emergencyContactPhone:
            formData.emergencyContactPhone.trim(),
          medicalHistory:
            formData.medicalHistory.trim() || null,
          status: formData.status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            data?.message ||
            `Failed to ${
              isCreate ? "create" : "update"
            } patient.`
        );
      }

      console.log(
        isCreate
          ? "Patient created successfully:"
          : "Patient updated successfully:",
        data
      );

      router.push("/patients");
      router.refresh();
    } catch (error) {
      const isCreate = mode === "create";
      console.error(
        (isCreate)
          ? "Patient creation error:"
          : "Patient update error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : `Failed to ${
              isCreate ? "create" : "update"
            } patient.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/patients");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* Basic Information */}
        <FormSection
          title="Basic Information"
          description="Enter the patient's basic personal information."
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* <FormField
              label="Patient ID"
              hint={
                mode === "create"
                  ? "Leave blank to generate automatically."
                  : undefined
              }
            >
              <FormInput
                value={formData.patientId}
                onChange={(event) =>
                  updateField(
                    "patientId",
                    event.target.value
                  )
                }
                placeholder="PT-1001"
                disabled={mode === "edit"}
              />
            </FormField> */}

            <div />

            <FormField
              label="First Name"
              required
              error={errors.firstName}
            >
              <FormInput
                value={formData.firstName}
                onChange={(event) =>
                  updateField(
                    "firstName",
                    event.target.value
                  )
                }
                placeholder="Enter first name"
                error={!!errors.firstName}
              />
            </FormField>

            <FormField
              label="Last Name"
              required
              error={errors.lastName}
            >
              <FormInput
                value={formData.lastName}
                onChange={(event) =>
                  updateField(
                    "lastName",
                    event.target.value
                  )
                }
                placeholder="Enter last name"
                error={!!errors.lastName}
              />
            </FormField>

            <FormField
              label="Email"
              required
              error={errors.email}
            >
              <FormInput
                type="email"
                value={formData.email}
                onChange={(event) =>
                  updateField(
                    "email",
                    event.target.value
                  )
                }
                placeholder="patient@example.com"
                error={!!errors.email}
              />
            </FormField>

            <FormField
              label="Phone"
              required
              error={errors.phone}
            >
              <FormInput
                type="tel"
                value={formData.phone}
                onChange={(event) =>
                  updateField(
                    "phone",
                    event.target.value
                  )
                }
                placeholder="+977 98XXXXXXXX"
                error={!!errors.phone}
              />
            </FormField>

            <FormField
              label="Gender"
              required
              error={errors.gender}
            >
              <FormSelect
                value={formData.gender}
                onChange={(event) =>
                  updateField(
                    "gender",
                    event.target.value as PatientFormData["gender"]
                  )
                }
                error={!!errors.gender}
              >
                <option value="">
                  Select gender
                </option>
                <option value="Male">
                  Male
                </option>
                <option value="Female">
                  Female
                </option>
                <option value="Other">
                  Other
                </option>
              </FormSelect>
            </FormField>

            <FormField
              label="Date of Birth"
              required
              error={errors.dateOfBirth}
            >
              <FormInput
                type="date"
                value={formData.dateOfBirth}
                onChange={(event) =>
                  updateField(
                    "dateOfBirth",
                    event.target.value
                  )
                }
                error={!!errors.dateOfBirth}
              />
            </FormField>

            <FormField label="Blood Group">
              <FormSelect
                value={formData.bloodGroup}
                onChange={(event) =>
                  updateField(
                    "bloodGroup",
                    event.target.value
                  )
                }
              >
                <option value="">
                  Select blood group
                </option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </FormSelect>
            </FormField>

          </div>
        </FormSection>

        {/* Address */}
        <FormSection
          title="Address"
          description="Enter the patient's residential address."
        >
          <FormField label="Address">
            <FormTextarea
              value={formData.address}
              onChange={(event) =>
                updateField(
                  "address",
                  event.target.value
                )
              }
              placeholder="Enter complete address"
              rows={3}
            />
          </FormField>
        </FormSection>

        {/* Emergency Contact */}
        <FormSection
          title="Emergency Contact"
          description="Provide someone who can be contacted in case of an emergency."
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <FormField
              label="Contact Name"
              required
              error={errors.emergencyContactName}
            >
              <FormInput
                value={formData.emergencyContactName}
                onChange={(event) =>
                  updateField(
                    "emergencyContactName",
                    event.target.value
                  )
                }
                placeholder="Enter emergency contact name"
                error={!!errors.emergencyContactName}
              />
            </FormField>

            <FormField
              label="Contact Phone"
              required
              error={errors.emergencyContactPhone}
            >
              <FormInput
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(event) =>
                  updateField(
                    "emergencyContactPhone",
                    event.target.value
                  )
                }
                placeholder="+977 98XXXXXXXX"
                error={!!errors.emergencyContactPhone}
              />
            </FormField>

          </div>
        </FormSection>

        {/* Medical Information */}
        <FormSection
          title="Medical Information"
          description="Record relevant medical information."
        >
          <FormField label="Medical History">
            <FormTextarea
              value={formData.medicalHistory}
              onChange={(event) =>
                updateField(
                  "medicalHistory",
                  event.target.value
                )
              }
              placeholder="Enter relevant medical history, allergies, conditions, etc."
              rows={5}
            />
          </FormField>
        </FormSection>

        {/* Status */}
        <FormSection
          title="Status"
          description="Control the patient's current status."
        >
          <div className="max-w-sm">
            <FormField label="Patient Status">
              <FormSelect
                value={formData.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value as PatientFormData["status"]
                  )
                }
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </FormSelect>
            </FormField>
          </div>
        </FormSection>

        <FormActions
          submitLabel={
            mode === "create"
              ? "Create Patient"
              : "Save Changes"
          }
          loading={loading}
          onCancel={handleCancel}
        />

      </div>
    </form>
  );
}