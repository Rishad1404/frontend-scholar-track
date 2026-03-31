
import { httpClient } from "@/lib/axios/httpClient";
import type { IUniversityResponse } from "@/types/university";

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