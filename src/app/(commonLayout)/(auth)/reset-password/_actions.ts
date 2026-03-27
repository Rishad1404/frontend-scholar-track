"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { IResetPasswordPayload, resetPasswordZodSchema } from "@/zod/auth.validation";

export const resetPasswordAction = async (
  payload: IResetPasswordPayload
): Promise<{ success: boolean; message?: string } | ApiErrorResponse> => {
  const parsedPayload = resetPasswordZodSchema.safeParse(payload);
  
  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid Input",
    };
  }

  // Strip confirmPassword before sending to backend
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { confirmPassword, ...backendPayload } = parsedPayload.data;

  try {
    const response = await httpClient.post<any>(
      "/auth/reset-password", 
      backendPayload
    );

    return {
      success: true,
      message: response?.message || "Password reset successfully",
    };
  } catch (error: any) {
    console.error("Reset Password Failed", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to reset password. The OTP might be invalid or expired.",
    };
  }
};