
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