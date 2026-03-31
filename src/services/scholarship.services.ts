import { httpClient } from "@/lib/axios/httpClient";
import type {
  IScholarshipsListResponse,
  IScholarshipResponse,
  IScholarshipDetails,
} from "@/types/scholarship";

const BASE = "/scholarships";

export const getAllScholarships = async (
  queryString: string,
): Promise<IScholarshipsListResponse> => {
  const res = await httpClient.get(`${BASE}?${queryString}`);
  return res as unknown as IScholarshipsListResponse;
};

export const getScholarshipById = async (
  id: string,
): Promise<{ success: boolean; message: string; data: IScholarshipDetails }> => {
  const res = await httpClient.get(`${BASE}/${id}`);
  return res as unknown as {
    success: boolean;
    message: string;
    data: IScholarshipDetails;
  };
};

export const createScholarship = async (
  formData: FormData,
): Promise<IScholarshipResponse> => {
  const res = await httpClient.post(BASE, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res as unknown as IScholarshipResponse;
};

export const updateScholarship = async (
  id: string,
  formData: FormData,
): Promise<IScholarshipResponse> => {
  const res = await httpClient.patch(`${BASE}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res as unknown as IScholarshipResponse;
};

export const changeScholarshipStatus = async (
  id: string,
  payload: { status: string },
): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.patch(`${BASE}/status/${id}`, payload);
  return res as unknown as { success: boolean; message: string };
};

export const deleteScholarship = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.delete(`${BASE}/${id}`);
  return res as unknown as { success: boolean; message: string };
};