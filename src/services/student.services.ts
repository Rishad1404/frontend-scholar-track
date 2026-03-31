import { httpClient } from "@/lib/axios/httpClient";
import type {
  IStudentsListResponse,
  IStudentDetails,
} from "@/types/student";

const BASE = "/students";

export const getAllStudents = async (
  queryString: string,
): Promise<IStudentsListResponse> => {
  const res = await httpClient.get(`${BASE}?${queryString}`);
  return res.data as unknown as IStudentsListResponse;
};

export const getStudentById = async (
  id: string,
): Promise<{ success: boolean; data: IStudentDetails }> => {
  const res = await httpClient.get(`${BASE}/${id}`);
  return res as unknown as { success: boolean; data: IStudentDetails };
};

export const changeAcademicStatus = async (
  id: string,
  payload: { academicStatus: string },
): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.patch(`${BASE}/${id}/academic-status`, payload);
  return res as unknown as { success: boolean; message: string };
};

export const deleteStudent = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.delete(`${BASE}/${id}`);
  return res as unknown as { success: boolean; message: string };
};