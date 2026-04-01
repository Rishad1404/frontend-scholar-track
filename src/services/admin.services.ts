// services/admin.services.ts

import { httpClient } from "@/lib/axios/httpClient";

const BASE = "/admins";

export const getAdminProfile = async (adminId: string) => {
  const res = await httpClient.get(`${BASE}/${adminId}`);
  return res;
};

export const updateAdminProfile = async (
  adminId: string,
  payload: FormData
) => {
  const res = await httpClient.patch(`${BASE}/${adminId}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res;
};