
import { httpClient } from "@/lib/axios/httpClient";
import type { IUniversityDetailResponse, IUniversityListResponse, IUniversityResponse } from "@/types/university";

const BASE = "/universities";

// GET single university by ID
export const getUniversityById = async (
  id: string
): Promise<IUniversityResponse> => {
  const res = await httpClient.get(`${BASE}/${id}`);
  return res as unknown as IUniversityResponse;
};

// PATCH update — uses FormData because backend accepts file upload
export const updateUniversity = async (
  id: string,
  formData: FormData
): Promise<IUniversityResponse> => {
  const res = await httpClient.patch(`${BASE}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res as unknown as IUniversityResponse;
};


export const getAllUniversities = async (
  queryString: string
): Promise<IUniversityListResponse> => {
  const res = await httpClient.get(`${BASE}?${queryString}`);
  return res as unknown as IUniversityListResponse;
};

export const getUniversityForSuperAdminById = async (
  id: string
): Promise<IUniversityDetailResponse> => {
  const res = await httpClient.get(`${BASE}/${id}`);
  return res as unknown as IUniversityDetailResponse;
};


export const getUniversityDetailById = async (
  id: string
): Promise<IUniversityDetailResponse> => {
  const res = await httpClient.get(`${BASE}/${id}`);
  return res as unknown as IUniversityDetailResponse;
};

export const updateUniversityStatus = async (
  id: string,
  payload: { status: string }
): Promise<IUniversityResponse> => {
  const res = await httpClient.patch(`${BASE}/${id}/status`, payload);
  return res as unknown as IUniversityResponse;
};

export const deleteUniversity = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.delete(`${BASE}/${id}`);
  return res as unknown as { success: boolean; message: string };
};