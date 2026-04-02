import { httpClient } from "@/lib/axios/httpClient";
import { IScholarshipListResponse, IScholarshipSingleResponse } from "@/types/scholarshipForStudents";


const BASE = "/scholarships";

export const getAllScholarships = async (
  queryString?: string
): Promise<IScholarshipListResponse> => {
  const url = queryString ? `${BASE}?${queryString}` : BASE;
  const res = await httpClient.get(url);
  return res as unknown as IScholarshipListResponse;
};

export const getScholarshipById = async (
  scholarshipId: string
): Promise<IScholarshipSingleResponse> => {
  const res = await httpClient.get(`${BASE}/${scholarshipId}`);
  return res as unknown as IScholarshipSingleResponse;
};