"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { IForgotPasswordPayload, forgotPasswordZodSchema } from "@/zod/auth.validation";

export const forgotPasswordAction = async (
  payload: IForgotPasswordPayload
): Promise<{ success: boolean; message?: string } | ApiErrorResponse> => {
  const parsedPayload = forgotPasswordZodSchema.safeParse(payload);
  
  if (!parsedPayload.success) {
    return {
      success: false,
      message: parsedPayload.error.issues[0].message || "Invalid Input",
    };
  }

  try {
    const response = await httpClient.post<any>(
      "/auth/forget-password", // Verify this matches your backend route
      parsedPayload.data
    );

    return {
      success: true,
      message: response?.message || "Password reset OTP sent to your email",
    };
  } catch (error: any) {
    console.error("Forgot Password Failed", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to process request. Please try again.",
    };
  }
};