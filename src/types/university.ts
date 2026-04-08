
export type UniversityStatus = "PENDING" | "APPROVED" | "SUSPENDED";

export interface IUniversityAdmin {
  id: string;
  userId: string;
  isOwner: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

export interface IUniversityDepartment {
  id: string;
  name: string;
}

export interface IUniversityCounts {
  admins: number;
  departments: number;
  scholarships: number;
  students: number;
  departmentHeads: number;
  reviewers: number;
}

export interface IUniversity {
  id: string;
  name: string;
  logoUrl: string | null;
  logoPublicId: string | null;
  website: string | null;
  status: UniversityStatus;
  stripeCustomerId: string | null;
  subscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  admins?: IUniversityAdmin[];
  departments?: IUniversityDepartment[];
  _count?: IUniversityCounts;
}

export interface IUniversityResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IUniversity;
}

export interface IUniversityListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IUniversity[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}


export interface IUniversityDetail extends Omit<IUniversity, "admins" | "departments"> {
  admins: {
    id: string;
    name: string;
    email: string;
    isOwner: boolean;
    subscriptionStatus: string;
    profilePhoto: string | null;
    user: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
  }[];
  departments: { id: string; name: string }[];
}

export const UNIVERSITY_STATUS_LABELS: Record<UniversityStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  SUSPENDED: "Suspended",
};

export const UNIVERSITY_STATUS_VARIANT: Record<
  UniversityStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  APPROVED: "default",
  SUSPENDED: "destructive",
};

export const UNIVERSITY_STATUS_COLORS: Record<UniversityStatus, string> = {
  PENDING: "#f59e0b",
  APPROVED: "#16a34a",
  SUSPENDED: "#dc2626",
};

export const VALID_UNIVERSITY_STATUS_TRANSITIONS: Record<
  UniversityStatus,
  UniversityStatus[]
> = {
  PENDING: ["APPROVED"],          
  APPROVED: ["SUSPENDED"],           
  SUSPENDED: ["APPROVED"],          
};

export interface IUniversityDetailResponse {
  success: boolean;
  message: string;
  data: IUniversityDetail;
}