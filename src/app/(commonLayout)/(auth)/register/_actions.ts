"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { IRegisterResponse } from "@/types/auth.types";
import { IRegisterPayload, registerZodSchema } from "@/zod/auth.validation";

export const registerAction = async (
  payload: IRegisterPayload,
): Promise<{ success: true; email: string } | ApiErrorResponse> => {
  const parsedPayload = registerZodSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const firstError =
      parsedPayload.error.issues[0].message || "Invalid Input";
    return { success: false, message: firstError };
  }

  try {
    const { confirmPassword, ...registerData } = parsedPayload.data;

    await httpClient.post<IRegisterResponse>(
      "/auth/register",
      registerData,
    );

    // Return success — let client handle redirect
    return { success: true, email: parsedPayload.data.email };
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    return {
      success: false,
      message:
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Registration failed",
    };
  }
};