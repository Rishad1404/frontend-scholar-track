// src/services/department.services.ts

import { httpClient } from "@/lib/axios/httpClient";
import type {
  IDepartmentListResponse,
  IDepartmentSingleResponse,
} from "@/types/department";
import type {
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "@/zod/department.validation";

const BASE = "/departments";

// GET all — paginated, supports query string
export const getAllDepartments = async (
  queryString?: string
): Promise<IDepartmentListResponse> => {
  const url = queryString ? `${BASE}?${queryString}` : BASE;
  const res = await httpClient.get(url);
  return res as unknown as IDepartmentListResponse;
};

// GET single
export const getDepartmentById = async (
  id: string
): Promise<IDepartmentSingleResponse> => {
  const res = await httpClient.get(`${BASE}/${id}`);
  return res as unknown as IDepartmentSingleResponse;
};

// POST create
export const createDepartment = async (
  data: CreateDepartmentInput
): Promise<IDepartmentSingleResponse> => {
  const res = await httpClient.post(BASE, data);
  return res as unknown as IDepartmentSingleResponse;
};

// PATCH update — backend expects { department: { name } }
export const updateDepartment = async (
  id: string,
  data: UpdateDepartmentInput
): Promise<IDepartmentSingleResponse> => {
  const res = await httpClient.patch(`${BASE}/${id}`, { department: data });
  return res as unknown as IDepartmentSingleResponse;
};

// DELETE (soft)
export const deleteDepartment = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.delete(`${BASE}/${id}`);
  return res as unknown as { success: boolean; message: string };
};