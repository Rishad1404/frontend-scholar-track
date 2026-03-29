
import { httpClient } from "@/lib/axios/httpClient";
import type {
  IAcademicTermListResponse,
  IAcademicTermSingleResponse,
} from "@/types/academicTerm";
import type { CreateAcademicTermInput } from "@/zod/academicTerm.validation";

const BASE = "/academic-terms";

export const getAllAcademicTerms =
  async (): Promise<IAcademicTermListResponse> => {
    const res = await httpClient.get<IAcademicTermListResponse>(BASE);
    return res.data;
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