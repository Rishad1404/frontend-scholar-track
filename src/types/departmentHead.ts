// src/types/departmentHead.ts

export type DeptHeadUserStatus = "ACTIVE" | "DELETED" | "BANNED";

export interface IDeptHeadUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  status: DeptHeadUserStatus;
}

export interface IDeptHeadUniversity {
  id: string;
  name: string;
}

export interface IDeptHeadDepartment {
  id: string;
  name: string;
}

export interface IDepartmentHead {
  id: string;
  userId: string;
  universityId: string;
  departmentId: string;
  designation: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;

  user: IDeptHeadUser;
  university: IDeptHeadUniversity;
  department: IDeptHeadDepartment;
}

export interface IDepartmentHeadMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IDepartmentHeadListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IDepartmentHead[];
  meta: IDepartmentHeadMeta;
}

export interface IDepartmentHeadSingleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: IDepartmentHead;
}