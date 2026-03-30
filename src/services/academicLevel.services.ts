/* eslint-disable @typescript-eslint/no-unused-vars */

import { httpClient } from "@/lib/axios/httpClient";
import type {
  IAcademicLevelListResponse,
  IAcademicLevelSingleResponse,
} from "@/types/academicLevel";
import type { CreateAcademicLevelInput } from "@/zod/academicLevel.validation";

const BASE = "/academic-level";

export const getAllAcademicLevels =
  async (queryString: string): Promise<IAcademicLevelListResponse> => {
    const res = await httpClient.get<IAcademicLevelListResponse>(BASE);
    const result = (res as unknown as IAcademicLevelListResponse).success
      ? (res as unknown as IAcademicLevelListResponse)
      : res.data;
    return result;
  };


export const createAcademicLevel = async (
  data: CreateAcademicLevelInput
): Promise<IAcademicLevelSingleResponse> => {
  const res = await httpClient.post<IAcademicLevelSingleResponse>(BASE, data);
  return res.data;
};

export const deleteAcademicLevel = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.delete<{ success: boolean; message: string }>(
    `${BASE}/${id}`
  );
  return res.data;
};