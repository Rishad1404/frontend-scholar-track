export type ScholarshipStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "CLOSED" | "CANCELLED";

export type DocumentType =
  | "TRANSCRIPT"
  | "INCOME_CERTIFICATE"
  | "NATIONAL_ID"
  | "PERSONAL_ESSAY"
  | "RECOMMENDATION_LETTER"
  | "OTHER";

export interface IScholarshipUniversity {
  id: string;
  name: string;
  logoUrl?: string | null;
}

export interface IScholarshipDepartment {
  id: string;
  name: string;
}

export interface IScholarshipLevel {
  id: string;
  name: string;
}

export interface IScholarshipApplication {
  id: string;
  status: string;
  studentId: string;
  student?: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
  };
}

/** Returned by GET /scholarships (list) */
export interface IScholarship {
  id: string;
  universityId: string;
  departmentId: string | null;
  levelId: string | null;
  title: string;
  description: string | null;
  deadline: string;
  document: string | null;
  documentPublicId: string | null;
  totalAmount: number;
  amountPerStudent: number;
  quota: number;
  status: ScholarshipStatus;
  minGpa: number | null;
  minCgpa: number | null;
  financialNeedRequired: boolean;
  requiredDocTypes: DocumentType[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  university: IScholarshipUniversity;
  department: IScholarshipDepartment | null;
  level: IScholarshipLevel | null;
  applications?: IScholarshipApplication[];
  _count?: {
    applications: number;
  };
}

/** Returned by GET /scholarships/:id (detail) */
export interface IScholarshipDetails extends IScholarship {
  university: IScholarshipUniversity & { logoUrl: string | null };
  applications: IScholarshipApplication[];
}

export interface IScholarshipsListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IScholarship[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IScholarshipResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IScholarship;
}

// ── Label maps ────────────────────────────────

export const SCHOLARSHIP_STATUS_LABELS: Record<ScholarshipStatus, string> = {
  DRAFT: "Draft",
  ACTIVE: "Active",
  PAUSED: "Paused",
  CLOSED: "Closed",
  CANCELLED: "Cancelled",
};

export const SCHOLARSHIP_STATUS_VARIANT: Record<
  ScholarshipStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  DRAFT: "secondary",
  ACTIVE: "default",
  PAUSED: "outline",
  CLOSED: "secondary",
  CANCELLED: "destructive",
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  TRANSCRIPT: "Transcript",
  INCOME_CERTIFICATE: "Income Certificate",
  NATIONAL_ID: "National ID",
  PERSONAL_ESSAY: "Personal Essay",
  RECOMMENDATION_LETTER: "Recommendation Letter",
  OTHER: "Other",
};

export const ALL_DOCUMENT_TYPES: DocumentType[] = [
  "TRANSCRIPT",
  "INCOME_CERTIFICATE",
  "NATIONAL_ID",
  "PERSONAL_ESSAY",
  "RECOMMENDATION_LETTER",
  "OTHER",
];

export const VALID_SCHOLARSHIP_STATUS_TRANSITIONS: Record<
  ScholarshipStatus,
  ScholarshipStatus[]
> = {
  DRAFT: ["ACTIVE", "CANCELLED"],
  ACTIVE: ["PAUSED", "CLOSED", "CANCELLED"],
  PAUSED: ["ACTIVE", "CLOSED", "CANCELLED"],
  CLOSED: [],
  CANCELLED: [],
};