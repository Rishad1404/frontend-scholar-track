import { httpClient } from "@/lib/axios/httpClient";
import type {
  IPublicScholarshipsResponse,
  IPublicScholarship,
} from "@/types/publicScholarship";

const BASE = "/scholarships";

export const getPublicScholarships = async (
  queryString: string,
): Promise<IPublicScholarshipsResponse> => {
  const res = await httpClient.get(`${BASE}/public?${queryString}`);
  return res as unknown as IPublicScholarshipsResponse;
};

export const getPublicScholarshipById = async (
  id: string,
): Promise<{ success: boolean; data: IPublicScholarship | null }> => {
  const res = await httpClient.get(`${BASE}/public?limit=1&id=${id}`);
  const parsed = res as unknown as IPublicScholarshipsResponse;
  const scholarship = parsed.data?.find((s) => s.id === id) ?? null;
  return { success: true, data: scholarship };
};
