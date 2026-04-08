
import { httpClient } from "@/lib/axios/httpClient";
import type {
  IPublicUniversitiesResponse,
  IPublicUniversityDetailResponse,
} from "@/types/publicUniversity";

const BASE = "/universities";

export const getPublicUniversities = async (
  queryString?: string
): Promise<IPublicUniversitiesResponse> => {
  const url = queryString ? `${BASE}/public?${queryString}` : `${BASE}/public`;
  const res = await httpClient.get(url);
  return res as unknown as IPublicUniversitiesResponse;
};

export const getPublicUniversityById = async (
  id: string
): Promise<IPublicUniversityDetailResponse> => {
  const res = await httpClient.get(`${BASE}/public/${id}`);
  return res as unknown as IPublicUniversityDetailResponse;
};