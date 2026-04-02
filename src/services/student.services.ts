import { httpClient } from "@/lib/axios/httpClient";
import type {
  IStudentsListResponse,
  IStudentDetails,
  IStudentMyProfile,
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


export const getStudentMyProfile = async (): Promise<{
  success: boolean;
  data: IStudentMyProfile;
}> => {
  const res = await httpClient.get(`${BASE}/my-profile`);
  return res as unknown as { success: boolean; data: IStudentMyProfile };
};

export const updateStudentProfile = async (payload: {
  student: { name?: string; phone?: string; address?: string; gender?: string };
}): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.patch(`${BASE}/update-profile`, payload);
  return res as unknown as { success: boolean; message: string };
};

export const uploadStudentProfilePhoto = async (
  formData: FormData
): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.patch(`${BASE}/profile-photo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res as unknown as { success: boolean; message: string };
};


export const completeAcademicInfo = async (payload: {
  departmentId: string;
  levelId: string;
  termId: string;
  studentIdNo: string;
  gpa: number;
  cgpa: number;
  creditHoursCompleted?: number;
}): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.post(`${BASE}/academic-info`, payload);
  return res as unknown as { success: boolean; message: string };
};

export const updateAcademicInfo = async (payload: {
  academicInfo: {
    departmentId?: string;
    levelId?: string;
    termId?: string;
    studentIdNo?: string;
    gpa?: number;
    cgpa?: number;
    creditHoursCompleted?: number;
  };
}): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.patch(`${BASE}/academic-info`, payload);
  return res as unknown as { success: boolean; message: string };
};

export const getDepartmentsByUniversity = async (
  universityId: string
): Promise<{ success: boolean; data: { id: string; name: string }[] }> => {
  const res = await httpClient.get(
    `/departments?universityId=${universityId}`
  );
  return res as unknown as {
    success: boolean;
    data: { id: string; name: string }[];
  };
};

export const getAcademicLevels = async (): Promise<{
  success: boolean;
  data: { id: string; name: string }[];
}> => {
  const res = await httpClient.get("/academic-level");
  return res as unknown as {
    success: boolean;
    data: { id: string; name: string }[];
  };
};

export const getAcademicTerms = async (): Promise<{
  success: boolean;
  data: { id: string; name: string }[];
}> => {
  const res = await httpClient.get("/academic-term");
  return res as unknown as {
    success: boolean;
    data: { id: string; name: string }[];
  };
};


export const completeProfile = async (payload: {
  universityId: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup?: string;
  phone?: string;
  address?: string;
}): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.post(`${BASE}/complete-profile`, payload);
  return res as unknown as { success: boolean; message: string };
};

export const getApprovedUniversities = async (): Promise<{
  success: boolean;
  data: { id: string; name: string }[];
}> => {
  const res = await httpClient.get("/universities?status=APPROVED");
  return res as unknown as {
    success: boolean;
    data: { id: string; name: string }[];
  };
};
