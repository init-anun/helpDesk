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

import {
  PatientOption,
  PaymentMethod,
  SessionMode,
  SessionStatus,
  SessionType,
  TherapistOption,
  TherapySession,
} from "./session-types";

interface SessionFormProps {
  patients: PatientOption[];
  therapists: TherapistOption[];
  initialData?: Partial<TherapySession>;
  mode?: "create" | "edit";
}

interface SessionFormData {
  patientId: string;
  therapistId: string;
  sessionDate: string;
  sessionTime: string;
  durationMinutes: string;

  sessionType: SessionType;
  status: SessionStatus;
  mode: SessionMode;
  paymentMethod: PaymentMethod;

  presentingConcerns: string;
  sessionGoals: string;
  interventions: string;
  clientResponse: string;
  progressNotes: string;
  clinicalNotes: string;
  riskAssessment: string;
  recommendations: string;
  homework: string;

  followUpRequired: boolean;
  nextSessionDate: string;

  cancellationReason: string;
  therapistNotes: string;
}

interface Errors {
  [key: string]: string | undefined;
}

const defaultValues: SessionFormData = {
  patientId: "",
  therapistId: "",
  sessionDate: "",
  sessionTime: "09:00",
  durationMinutes: "60",

  sessionType: "individual",
  status: "scheduled",
  mode: "in_person",
  paymentMethod: "cash",

  presentingConcerns: "",
  sessionGoals: "",
  interventions: "",
  clientResponse: "",
  progressNotes: "",
  clinicalNotes: "",
  riskAssessment: "",
  recommendations: "",
  homework: "",

  followUpRequired: false,
  nextSessionDate: "",

  cancellationReason: "",
  therapistNotes: "",
};

function convertInitialData(
  initialData?: Partial<TherapySession>
): SessionFormData {
  if (!initialData) {
    return defaultValues;
  }

  const date = initialData.sessionDate
    ? new Date(initialData.sessionDate)
    : null;

  return {
    ...defaultValues,

    patientId: initialData.patientId
      ? String(initialData.patientId)
      : "",

    therapistId: initialData.therapistId
      ? String(initialData.therapistId)
      : "",

    sessionDate: date
      ? date.toISOString().slice(0, 10)
      : "",

    sessionTime: date
      ? date.toTimeString().slice(0, 5)
      : "09:00",

    durationMinutes: initialData.durationMinutes
      ? String(initialData.durationMinutes)
      : "60",

    sessionType:
      initialData.sessionType ?? "individual",

    status:
      initialData.status ?? "scheduled",

    mode:
      initialData.mode ?? "in_person",

    paymentMethod:
      initialData.paymentMethod ?? "cash",

    presentingConcerns:
      initialData.presentingConcerns ?? "",

    sessionGoals:
      initialData.sessionGoals ?? "",

    interventions:
      initialData.interventions ?? "",

    clientResponse:
      initialData.clientResponse ?? "",

    progressNotes:
      initialData.progressNotes ?? "",

    clinicalNotes:
      initialData.clinicalNotes ?? "",

    riskAssessment:
      initialData.riskAssessment ?? "",

    recommendations:
      initialData.recommendations ?? "",

    homework:
      initialData.homework ?? "",

    followUpRequired:
      initialData.followUpRequired ?? false,

    nextSessionDate: initialData.nextSessionDate
      ? new Date(initialData.nextSessionDate)
          .toISOString()
          .slice(0, 10)
      : "",

    cancellationReason:
      initialData.cancellationReason ?? "",

    therapistNotes:
      initialData.therapistNotes ?? "",
  };
}

export default function SessionForm({
  patients,
  therapists,
  initialData,
  mode = "create",
}: SessionFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<SessionFormData>(
    convertInitialData(initialData)
  );

  const [errors, setErrors] = useState<Errors>({});

  const [loading, setLoading] = useState(false);

  const updateField = <K extends keyof SessionFormData>(
    field: K,
    value: SessionFormData[K]
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
    const nextErrors: Errors = {};

    if (!formData.patientId) {
      nextErrors.patientId = "Patient is required.";
    }

    if (!formData.therapistId) {
      nextErrors.therapistId =
        "Therapist is required.";
    }

    if (!formData.sessionDate) {
      nextErrors.sessionDate =
        "Session date is required.";
    }

    if (!formData.sessionTime) {
      nextErrors.sessionTime =
        "Session time is required.";
    }

    if (
      !formData.durationMinutes ||
      Number(formData.durationMinutes) <= 0
    ) {
      nextErrors.durationMinutes =
        "Enter a valid duration.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
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
      const sessionDateTime = `${formData.sessionDate}T${formData.sessionTime}:00`;

      const payload = {
        patient_id: Number(formData.patientId),
        therapist_id: Number(formData.therapistId),

        session_date: sessionDateTime,

        duration_minutes: Number(
          formData.durationMinutes
        ),

        session_type: formData.sessionType,
        status: formData.status,
        mode: formData.mode,

        payment_method: formData.paymentMethod,

        presenting_concerns:
          formData.presentingConcerns || null,

        session_goals:
          formData.sessionGoals || null,

        interventions:
          formData.interventions || null,

        client_response:
          formData.clientResponse || null,

        progress_notes:
          formData.progressNotes || null,

        clinical_notes:
          formData.clinicalNotes || null,

        risk_assessment:
          formData.riskAssessment || null,

        recommendations:
          formData.recommendations || null,

        homework:
          formData.homework || null,

        follow_up_required:
          formData.followUpRequired,

        next_session_date:
          formData.nextSessionDate || null,

        cancellation_reason:
          formData.cancellationReason || null,

        therapist_notes:
          formData.therapistNotes || null,
      };

      /*
       * Replace with your FastAPI request.
       *
       * CREATE:
       * POST /api/sessions
       *
       * EDIT:
       * PUT /api/sessions/{id}
       *
       * The backend must verify:
       *
       * 1. Patient exists and is a patient SubAccount.
       * 2. Therapist exists and is a therapist SubAccount.
       * 3. Therapist is available at this time.
       * 4. Therapist has no overlapping session.
       */

      console.log(
        mode === "create"
          ? "Creating session:"
          : "Updating session:",
        payload
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      router.push("/schedule");
      router.refresh();
    } catch (error) {
      console.error(
        "Session save failed:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/schedule");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* Appointment */}
        <FormSection
          title="Appointment"
          description="Select the patient, therapist, date and time for this session."
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <FormField
              label="Patient"
              required
              error={errors.patientId}
            >
              <FormSelect
                value={formData.patientId}
                onChange={(event) =>
                  updateField(
                    "patientId",
                    event.target.value
                  )
                }
                error={!!errors.patientId}
              >
                <option value="">
                  Select patient
                </option>

                {patients.map((patient) => (
                  <option
                    key={patient.id}
                    value={patient.id}
                  >
                    {patient.name} ({patient.patientId})
                  </option>
                ))}
              </FormSelect>
            </FormField>

            <FormField
              label="Therapist"
              required
              error={errors.therapistId}
            >
              <FormSelect
                value={formData.therapistId}
                onChange={(event) =>
                  updateField(
                    "therapistId",
                    event.target.value
                  )
                }
                error={!!errors.therapistId}
              >
                <option value="">
                  Select therapist
                </option>

                {therapists.map((therapist) => (
                  <option
                    key={therapist.id}
                    value={therapist.id}
                  >
                    {therapist.name} ({therapist.therapistId})
                  </option>
                ))}
              </FormSelect>
            </FormField>

            <FormField
              label="Date"
              required
              error={errors.sessionDate}
            >
              <FormInput
                type="date"
                value={formData.sessionDate}
                onChange={(event) =>
                  updateField(
                    "sessionDate",
                    event.target.value
                  )
                }
                error={!!errors.sessionDate}
              />
            </FormField>

            <FormField
              label="Time"
              required
              error={errors.sessionTime}
            >
              <FormInput
                type="time"
                value={formData.sessionTime}
                onChange={(event) =>
                  updateField(
                    "sessionTime",
                    event.target.value
                  )
                }
                error={!!errors.sessionTime}
              />
            </FormField>

            <FormField
              label="Duration"
              required
              error={errors.durationMinutes}
            >
              <FormSelect
                value={formData.durationMinutes}
                onChange={(event) =>
                  updateField(
                    "durationMinutes",
                    event.target.value
                  )
                }
                error={!!errors.durationMinutes}
              >
                <option value="30">
                  30 minutes
                </option>
                <option value="45">
                  45 minutes
                </option>
                <option value="60">
                  60 minutes
                </option>
                <option value="90">
                  90 minutes
                </option>
                <option value="120">
                  120 minutes
                </option>
              </FormSelect>
            </FormField>

            <FormField label="Session Type">
              <FormSelect
                value={formData.sessionType}
                onChange={(event) =>
                  updateField(
                    "sessionType",
                    event.target.value as SessionType
                  )
                }
              >
                <option value="initial_assessment">
                  Initial Assessment
                </option>
                <option value="individual">
                  Individual
                </option>
                <option value="couples">
                  Couples
                </option>
                <option value="family">
                  Family
                </option>
                <option value="group">
                  Group
                </option>
                <option value="follow_up">
                  Follow Up
                </option>
                <option value="crisis">
                  Crisis
                </option>
              </FormSelect>
            </FormField>

          </div>
        </FormSection>

        {/* Payment */}
        <FormSection
          title="Payment"
          description="Record the payment method associated with this appointment."
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <FormField label="Payment Method">
              <FormSelect
                value={formData.paymentMethod}
                onChange={(event) =>
                  updateField(
                    "paymentMethod",
                    event.target.value as PaymentMethod
                  )
                }
              >
                <option value="cash">
                  Cash
                </option>
                <option value="card">
                  Card
                </option>
                <option value="bank_transfer">
                  Bank Transfer
                </option>
                <option value="online">
                  Online
                </option>
              </FormSelect>
            </FormField>

            <FormField label="Session Mode">
              <FormSelect
                value={formData.mode}
                onChange={(event) =>
                  updateField(
                    "mode",
                    event.target.value as SessionMode
                  )
                }
              >
                <option value="in_person">
                  In Person
                </option>
                <option value="telehealth">
                  Telehealth
                </option>
                <option value="phone">
                  Phone
                </option>
              </FormSelect>
            </FormField>

          </div>
        </FormSection>

        {/* Clinical Information */}
        <FormSection
          title="Clinical Information"
          description="Information related to the therapy session."
        >
          <div className="space-y-5">

            <FormField label="Presenting Concerns">
              <FormTextarea
                value={formData.presentingConcerns}
                onChange={(event) =>
                  updateField(
                    "presentingConcerns",
                    event.target.value
                  )
                }
                placeholder="Describe the presenting concerns..."
              />
            </FormField>

            <FormField label="Session Goals">
              <FormTextarea
                value={formData.sessionGoals}
                onChange={(event) =>
                  updateField(
                    "sessionGoals",
                    event.target.value
                  )
                }
                placeholder="What are the goals for this session?"
              />
            </FormField>

            <FormField label="Interventions">
              <FormTextarea
                value={formData.interventions}
                onChange={(event) =>
                  updateField(
                    "interventions",
                    event.target.value
                  )
                }
                placeholder="Interventions used during the session..."
              />
            </FormField>

            <FormField label="Client Response">
              <FormTextarea
                value={formData.clientResponse}
                onChange={(event) =>
                  updateField(
                    "clientResponse",
                    event.target.value
                  )
                }
                placeholder="Client response to the interventions..."
              />
            </FormField>

            <FormField label="Progress Notes">
              <FormTextarea
                value={formData.progressNotes}
                onChange={(event) =>
                  updateField(
                    "progressNotes",
                    event.target.value
                  )
                }
                placeholder="Record progress made during the session..."
              />
            </FormField>

          </div>
        </FormSection>

        {/* Clinical Notes */}
        <FormSection
          title="Clinical Notes"
          description="Additional clinical documentation."
        >
          <div className="space-y-5">

            <FormField label="Clinical Notes">
              <FormTextarea
                value={formData.clinicalNotes}
                onChange={(event) =>
                  updateField(
                    "clinicalNotes",
                    event.target.value
                  )
                }
                placeholder="Additional clinical notes..."
                rows={5}
              />
            </FormField>

            <FormField label="Risk Assessment">
              <FormTextarea
                value={formData.riskAssessment}
                onChange={(event) =>
                  updateField(
                    "riskAssessment",
                    event.target.value
                  )
                }
                placeholder="Risk assessment information..."
              />
            </FormField>

            <FormField label="Recommendations">
              <FormTextarea
                value={formData.recommendations}
                onChange={(event) =>
                  updateField(
                    "recommendations",
                    event.target.value
                  )
                }
                placeholder="Recommendations for the patient..."
              />
            </FormField>

            <FormField label="Homework">
              <FormTextarea
                value={formData.homework}
                onChange={(event) =>
                  updateField(
                    "homework",
                    event.target.value
                  )
                }
                placeholder="Homework or activities assigned..."
              />
            </FormField>

          </div>
        </FormSection>

        {/* Follow-up */}
        <FormSection
          title="Follow-up"
          description="Configure the next appointment and follow-up requirements."
        >
          <div className="space-y-5">

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={formData.followUpRequired}
                onChange={(event) =>
                  updateField(
                    "followUpRequired",
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              <span className="text-sm text-slate-700">
                Follow-up session required
              </span>
            </label>

            {formData.followUpRequired && (
              <div className="max-w-sm">
                <FormField label="Next Session Date">
                  <FormInput
                    type="date"
                    value={formData.nextSessionDate}
                    onChange={(event) =>
                      updateField(
                        "nextSessionDate",
                        event.target.value
                      )
                    }
                  />
                </FormField>
              </div>
            )}

          </div>
        </FormSection>

        {/* Status */}
        <FormSection
          title="Session Status"
          description="Update the current status of this session."
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <FormField label="Status">
              <FormSelect
                value={formData.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value as SessionStatus
                  )
                }
              >
                <option value="scheduled">
                  Scheduled
                </option>
                <option value="in_progress">
                  In Progress
                </option>
                <option value="completed">
                  Completed
                </option>
                <option value="cancelled">
                  Cancelled
                </option>
                <option value="no_show">
                  No Show
                </option>
              </FormSelect>
            </FormField>

            {formData.status === "cancelled" && (
              <FormField label="Cancellation Reason">
                <FormInput
                  value={formData.cancellationReason}
                  onChange={(event) =>
                    updateField(
                      "cancellationReason",
                      event.target.value
                    )
                  }
                  placeholder="Reason for cancellation"
                />
              </FormField>
            )}

          </div>
        </FormSection>

        {/* Therapist Notes */}
        <FormSection
          title="Therapist Notes"
          description="Additional private notes for the therapist."
        >
          <FormField label="Therapist Notes">
            <FormTextarea
              value={formData.therapistNotes}
              onChange={(event) =>
                updateField(
                  "therapistNotes",
                  event.target.value
                )
              }
              placeholder="Additional therapist notes..."
              rows={5}
            />
          </FormField>
        </FormSection>

        <FormActions
          submitLabel={
            mode === "create"
              ? "Create Session"
              : "Save Changes"
          }
          loading={loading}
          onCancel={handleCancel}
        />

      </div>
    </form>
  );
}