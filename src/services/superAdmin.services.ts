/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";


const PROFILE_BASE = "/users/me"; 
const AUTH_BASE = "/auth/change-password";

/**
 * Fetch the current logged-in user's profile
 */
export const getMyProfile = async (): Promise<{ success: boolean; data: any }> => {
  const res = await httpClient.get(PROFILE_BASE);
  return res as unknown as { success: boolean; data: any };
};

/**
 * Update the current logged-in user's profile
 */
export const updateMyProfile = async (payload: {
  name?: string;
  phone?: string;
}): Promise<{ success: boolean; data: any; message: string }> => {
  const res = await httpClient.patch(PROFILE_BASE, payload);
  return res as unknown as { success: boolean; data: any; message: string };
};

/**
 * Change the user's password
 */
export const changePassword = async (payload: {
  oldPassword?: string;
  newPassword?: string;
}): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.post(AUTH_BASE, payload);
  return res as unknown as { success: boolean; message: string };
};

// ─── Super Admin Specific Endpoints (Placeholders for later) ───

export const getSystemStats = async (): Promise<{ success: boolean; data: any }> => {
  const res = await httpClient.get("/admin/system-stats");
  return res as unknown as { success: boolean; data: any };
};