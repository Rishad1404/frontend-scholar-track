// src/services/academicTerm.services.ts

import { httpClient } from "@/lib/axios/httpClient";
import { IAcademicLevelListResponse } from "@/types/academicLevel";
import type {
  IAcademicTermListResponse,
  IAcademicTermSingleResponse,
} from "@/types/academicTerm";
import type { CreateAcademicTermInput } from "@/zod/academicTerm.validation";

const BASE = "/academic-term";

export const getAllAcademicTerms =
  async (queryString: string): Promise<IAcademicTermListResponse> => {
    const res = await httpClient.get< IAcademicTermListResponse>(BASE);
    const result = (res as unknown as IAcademicLevelListResponse).success
      ? (res as unknown as IAcademicLevelListResponse)
      : res.data;
    return result;
  };

export const createAcademicTerm = async (
  data: CreateAcademicTermInput
): Promise<IAcademicTermSingleResponse> => {
  const res = await httpClient.post<IAcademicTermSingleResponse>(BASE, data);
  return res.data;
};

export const deleteAcademicTerm = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.delete<{ success: boolean; message: string }>(
    `${BASE}/${id}`
  );
  return res.data;
};