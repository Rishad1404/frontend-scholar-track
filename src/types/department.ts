// src/types/department.ts

export interface IDepartmentUniversity {
  id: string;
  name: string;
}

export interface IDepartmentHeadUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export interface IDepartmentHead {
  id: string;
  userId: string;
  universityId: string;
  departmentId: string;
  designation: string | null;
  phone: string | null;
  user: IDepartmentHeadUser;
}

export interface IDepartment {
  id: string;
  universityId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  university?: IDepartmentUniversity;
  departmentHeads?: IDepartmentHead[];
  _count?: {
    departmentHeads: number;
    scholarships: number;
    studentAcademicInfos: number;
  };
}

export interface IDepartmentMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IDepartmentListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IDepartment[];
  meta: IDepartmentMeta;
}

export interface IDepartmentSingleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IDepartment;
}