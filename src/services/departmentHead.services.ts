// src/services/departmentHead.services.ts

import { httpClient } from "@/lib/axios/httpClient";
import type {
  IDepartmentHeadListResponse,
  IDepartmentHeadSingleResponse,
} from "@/types/departmentHead";
import type { UpdateDepartmentHeadInput } from "@/zod/departmentHead.validation";

const BASE = "/department-heads";

export const getAllDepartmentHeads = async (
  queryString?: string
): Promise<IDepartmentHeadListResponse> => {
  const url = queryString ? `${BASE}?${queryString}` : BASE;
  const res = await httpClient.get(url);
  return res as unknown as IDepartmentHeadListResponse;
};

export const getDepartmentHeadById = async (
  id: string
): Promise<IDepartmentHeadSingleResponse> => {
  const res = await httpClient.get(`${BASE}/${id}`);
  return res as unknown as IDepartmentHeadSingleResponse;
};

// Backend expects { departmentHead: { name?, phone?, designation? } }
export const updateDepartmentHead = async (
  id: string,
  data: UpdateDepartmentHeadInput
): Promise<IDepartmentHeadSingleResponse> => {
  const res = await httpClient.patch(`${BASE}/${id}`, {
    departmentHead: data,
  });
  return res as unknown as IDepartmentHeadSingleResponse;
};

export const deleteDepartmentHead = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.delete(`${BASE}/${id}`);
  return res as unknown as { success: boolean; message: string };
};