// ──────────────────────────────────────────────
// Enums / Literal unions
// ──────────────────────────────────────────────
export type Gender = "MALE" | "FEMALE" | "OTHER";

export type BloodGroup =
  | "A_POS" | "A_NEG"
  | "B_POS" | "B_NEG"
  | "O_POS" | "O_NEG"
  | "AB_POS" | "AB_NEG";

export type StudentAcademicStatus =
  | "REGULAR"
  | "PROBATION"
  | "SUSPENDED"
  | "DROPPED_OUT";


  export const STATUS_CONFIG: Record<
  StudentAcademicStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  REGULAR: { label: "Regular", color: "#16a34a", bg: "#16a34a15", border: "#16a34a40" },
  PROBATION: { label: "Probation", color: "#d97706", bg: "#d9770615", border: "#d9770640" },
  SUSPENDED: { label: "Suspended", color: "#dc2626", bg: "#dc262615", border: "#dc262640" },
  DROPPED_OUT: { label: "Dropped Out", color: "#6b7280", bg: "#6b728015", border: "#6b728040" },
};

export type UserStatus = "ACTIVE" | "DELETED" | "BANNED";

export type ApplicationStatus =
  | "DRAFT" | "SUBMITTED" | "SCREENING"
  | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "DISBURSED";

export interface IStudentUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  status: UserStatus;
  emailVerified?: boolean;
}

export interface IStudentUniversity {
  id: string;
  name: string;
  logoUrl?: string | null;
}

export interface IStudentAcademicInfo {
  id: string;
  studentId: string;
  studentIdNo: string | null;
  departmentId: string;
  levelId: string;
  termId: string;
  gpa: number;
  cgpa: number;
  creditHoursCompleted: number;
  academicStatus: StudentAcademicStatus;
  createdAt: string;
  updatedAt: string;
  department: { id: string; name: string };
  level: { id: string; name: string };
  term: { id: string; name: string };
}

export interface IStudentApplication {
  id: string;
  status: ApplicationStatus;
  scholarship: { id: string; title: string };
}

export interface IStudentDisbursement {
  id: string;
  amount: number;
  status: string;
}



/** Returned by GET /students (list) */
export interface IStudent {
  id: string;
  name: string;
  email: string;
  profilePhoto: string | null;
  gender: Gender | null;
  dateOfBirth: string | null;
  bloodGroup: BloodGroup | null;
  phone: string | null;
  address: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  user: IStudentUser;
  university: IStudentUniversity | null;
  academicInfo: IStudentAcademicInfo | null;
  _count?: {
    applications: number;
    disbursements: number;
  };
}

export interface IStudentDetails extends IStudent {
  user: IStudentUser & { emailVerified: boolean };
  applications: IStudentApplication[];
  disbursements?: IStudentDisbursement[];
}


export interface IStudentQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  gender?: Gender;
  "academicInfo.departmentId"?: string;
  "academicInfo.levelId"?: string;
  "academicInfo.termId"?: string;
  "academicInfo.academicStatus"?: StudentAcademicStatus;
  include?: string;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IStudentsResponse {
  data: IStudent[];
  meta: IMeta;
}


export const ACADEMIC_STATUS_LABELS: Record<StudentAcademicStatus, string> = {
  REGULAR: "Regular",
  PROBATION: "Probation",
  SUSPENDED: "Suspended",
  DROPPED_OUT: "Dropped Out",
};

export const ACADEMIC_STATUS_VARIANT: Record<
  StudentAcademicStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  REGULAR: "default",
  PROBATION: "outline",
  SUSPENDED: "destructive",
  DROPPED_OUT: "secondary",
};

export const USER_STATUS_VARIANT: Record<
  UserStatus,
  "default" | "secondary" | "destructive"
> = {
  ACTIVE: "default",
  DELETED: "destructive",
  BANNED: "destructive",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  SCREENING: "Screening",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  DISBURSED: "Disbursed",
};

export const GENDER_LABELS: Record<Gender, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

export const BLOOD_GROUP_LABELS: Record<BloodGroup, string> = {
  A_POS: "A+",
  A_NEG: "A−",
  B_POS: "B+",
  B_NEG: "B−",
  O_POS: "O+",
  O_NEG: "O−",
  AB_POS: "AB+",
  AB_NEG: "AB−",
};

export const VALID_STATUS_TRANSITIONS: Record<StudentAcademicStatus, StudentAcademicStatus[]> = {
  REGULAR: ["PROBATION", "SUSPENDED", "DROPPED_OUT"],
  PROBATION: ["REGULAR", "SUSPENDED", "DROPPED_OUT"],
  SUSPENDED: ["REGULAR"],
  DROPPED_OUT: [],
};


export interface IStudentsListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IStudent[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}


export interface IStudentMyProfile {
  id: string;
  userId: string;
  universityId: string | null;
  gender: Gender | null;
  dateOfBirth: string | null;
  bloodGroup: BloodGroup | null;
  phone: string | null;
  address: string | null;
  profilePhoto: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    emailVerified: boolean;
  };
  university: {
    id: string;
    name: string;
    logoUrl?: string;
  } | null;
  academicInfo: IStudentAcademicInfo | null;
}