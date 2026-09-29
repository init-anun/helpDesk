export type SessionType =
  | "initial_assessment"
  | "individual"
  | "couples"
  | "family"
  | "group"
  | "follow_up"
  | "crisis";

export type SessionStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type SessionMode =
  | "in_person"
  | "telehealth"
  | "phone";

export type PaymentMethod =
  | "cash"
  | "card"
  | "bank_transfer"
  | "online";

export interface PatientOption {
  id: number;
  name: string;
  patientId: string;
}

export interface TherapistOption {
  id: number;
  name: string;
  therapistId: string;
}

export interface TherapySession {
  id: number;

  patientId: number;
  patientName: string;
  patientCode: string;

  therapistId: number;
  therapistName: string;
  therapistCode: string;

  sessionDate: string;
  durationMinutes: number;

  sessionType: SessionType;
  status: SessionStatus;
  mode: SessionMode;

  paymentMethod: PaymentMethod;

  presentingConcerns?: string;
  sessionGoals?: string;
  interventions?: string;
  clientResponse?: string;
  progressNotes?: string;
  clinicalNotes?: string;
  riskAssessment?: string;
  recommendations?: string;
  homework?: string;

  followUpRequired: boolean;
  nextSessionDate?: string;

  cancellationReason?: string;
  therapistNotes?: string;

  createdAt: string;
  updatedAt: string;
}