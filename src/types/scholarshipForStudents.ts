
export type ScholarshipStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "CLOSED" | "CANCELLED";

export interface IScholarship {
  id: string;
  title: string;
  description: string | null;
  universityId: string;
  departmentId: string | null;
  levelId: string | null;
  totalAmount: number;
  amountPerStudent: number;
  quota: number;
  deadline: string;
  requiredDocTypes: string[];
  minGpa: number | null;
  minCgpa: number | null;
  financialNeedRequired: boolean;
  document: string | null;
  status: ScholarshipStatus;
  createdAt: string;
  updatedAt: string;
  category: string;
  university: { id: string; name: string; logoUrl?: string };
  department: { id: string; name: string } | null;
  level: { id: string; name: string } | null;
  applications?: {
    id: string;
    status: string;
    studentId: string;
  }[];
}

export interface IScholarshipListResponse {
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

export interface IScholarshipSingleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IScholarship;
}
