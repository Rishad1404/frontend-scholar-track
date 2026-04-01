/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";

interface IChangePasswordResponse {
  message?: string;
  data?: unknown;
}

export async function changePasswordAction(payload: {
  currentPassword: string;
  newPassword: string;
}) {
  try {
    const res = await httpClient.post<IChangePasswordResponse>("/auth/change-password", payload);
    return { 
      success: true, 
      message: res.data?.message || "Password changed successfully" 
    };
  } catch (error: any) { 
    return { 
      success: false, 
      message: error?.response?.data?.message || error?.message || "Failed to change password" 
    };
  }
}