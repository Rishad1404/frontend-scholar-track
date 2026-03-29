import { httpClient } from "@/lib/axios/httpClient";
import { IAcceptInvitePayload, ICreateInvitePayload } from "@/types/invites.types";

// ═══════════════════════════════════════════
// ADMIN-SIDE (Protected)
// ═══════════════════════════════════════════

export const getInvites = async (params?: {
  page?: number;
  limit?: number;
}) => {
  const response = await httpClient.get("/invites", { params });
  return response.data;
};

export const createInvite = async (data: ICreateInvitePayload) => {
  const response = await httpClient.post("/invites/send", data);
  return response.data;
};

export const cancelInvite = async (inviteId: string) => {
  const response = await httpClient.delete(`/invites/${inviteId}`);
  return response.data;
};

// ═══════════════════════════════════════════
// PUBLIC-SIDE (Accept Invite Flow)
// ═══════════════════════════════════════════

export const acceptInvite = async (data: IAcceptInvitePayload) => {
  const response = await httpClient.post("/invites/accept", data);
  return response.data;
};

// ═══════════════════════════════════════════
// DEPARTMENTS
// ═══════════════════════════════════════════

// Get ALL departments (public - no auth)
export const getAllDepartments = async () => {
  const response = await httpClient.get("/departments");
  return response.data;
};

// Get departments for a specific university
export const getDepartmentsByUniversity = async (universityId: string) => {
  const response = await httpClient.get(
    `/departments/university/${universityId}`
  );
  return response.data;
};