import type { DocumentType, ScholarshipStatus } from "./scholarship";
import type { StudentAcademicStatus } from "./student";

// ── Enums ───────────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "SCREENING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "DISBURSED";

// ── Nested shapes (LIST view — matches base include) ────────────────────────

export interface IApplicationStudentList {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export interface IApplicationScholarshipList {
  id: string;
  title: string;
  amountPerStudent: number;
  departmentId: string | null;
  department: { id: string; name: string } | null;
  university: { id: string; name: string };
}

// ── Nested shapes (DETAIL view — matches getApplicationById include) ────────

export interface IApplicationStudentDetail {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  academicInfo: {
    id: string;
    studentIdNo: string | null;
    departmentId: string;
    levelId: string;
    termId: string;
    gpa: number;
    cgpa: number;
    creditHoursCompleted: number;
    academicStatus: StudentAcademicStatus;
    department: { id: string; name: string };
    level: { id: string; name: string };
    term: { id: string; name: string };
  } | null;
}

export interface IApplicationScholarshipDetail {
  id: string;
  title: string;
  description: string | null;
  totalAmount: number;
  amountPerStudent: number;
  quota: number;
  deadline: string;
  status: ScholarshipStatus;
  requiredDocTypes: DocumentType[];
  departmentId: string | null;
  universityId: string;
  department: { id: string; name: string } | null;
  level: { id: string; name: string } | null;
  university: { id: string; name: string };
  minGpa: number | null;
  minCgpa: number | null;
  financialNeedRequired: boolean;
}

export interface IApplicationDocument {
  id: string;
  type: DocumentType;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

export interface IApplicationScreening {
  id: string;
  passed: boolean;
  comment: string | null;
  reviewedAt: string;
  departmentHead: {
    id: string;
    user: { id: string; name: string; email: string };
  };
}

export interface IApplicationReview {
  id: string;
  gpaScore: number;
  essayScore: number;
  financialScore: number;
  criteriaScore: number;
  totalScore: number;
  notes: string | null;
  submittedAt: string;
  reviewer: {
    id: string;
    user: { id: string; name: string; email: string };
  };
}

// ── Main Application (LIST) ─────────────────────────────────────────────────

export interface IApplication {
  id: string;
  studentId: string;
  scholarshipId: string;
  universityId: string;
  status: ApplicationStatus;
  essay: string | null;
  financialInfo: Record<string, unknown> | null;
  aiEligible: boolean | null;
  aiEligibleReason: string | null;
  aiScore: number | null;
  aiSummary: string | null;
  aiEssayScore: number | null;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  student: IApplicationStudentList;
  scholarship: IApplicationScholarshipList;
}

// ── Main Application (DETAIL — from getApplicationById) ─────────────────────

export interface IApplicationDetails {
  id: string;
  studentId: string;
  scholarshipId: string;
  universityId: string;
  status: ApplicationStatus;
  essay: string | null;
  financialInfo: Record<string, unknown> | null;
  aiEligible: boolean | null;
  aiEligibleReason: string | null;
  aiScore: number | null;
  aiSummary: string | null;
  aiEssayScore: number | null;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  student: IApplicationStudentDetail;
  scholarship: IApplicationScholarshipDetail;
  documents: IApplicationDocument[];
  screening: IApplicationScreening | null;
  reviews: IApplicationReview[];
}

// ── AI Evaluation Response ──────────────────────────────────────────────────

export interface IAiEvaluationResult {
  aiEligible: boolean;
  aiEligibleReason: string;
  aiScore: number;
  aiEssayScore: number;
  aiSummary: string;
}

export interface IAiEvaluateResponse {
  application: IApplicationDetails;
  aiEvaluation: IAiEvaluationResult;
}

export interface IAiEvaluationView {
  applicationId: string;
  applicationStatus: ApplicationStatus;
  scholarship: string;
  student: string;
  aiEvaluation: {
    eligible: boolean;
    eligibleReason: string;
    overallScore: number;
    essayScore: number;
    summary: string;
  };
}

// ── Response wrappers ───────────────────────────────────────────────────────

export interface IApplicationsListResponse {
  data: IApplication[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ── Display-label maps ──────────────────────────────────────────────────────

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  SCREENING: "Screening",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  DISBURSED: "Disbursed",
};

export const APPLICATION_STATUS_VARIANT: Record<
  ApplicationStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "secondary",
  SUBMITTED: "outline",
  SCREENING: "outline",
  UNDER_REVIEW: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
  DISBURSED: "default",
};



export interface IDecisionReviewSummary {
  totalReviews: number;
  averageScore: number;
  maxPossibleScore: number;
}

export interface IDecisionResult {
  status: "APPROVED" | "REJECTED";
  remarks: string | null;
  reviewSummary: IDecisionReviewSummary;
}

export interface IMakeDecisionResponse {
  application: IApplicationDetails;
  decision: IDecisionResult;
}