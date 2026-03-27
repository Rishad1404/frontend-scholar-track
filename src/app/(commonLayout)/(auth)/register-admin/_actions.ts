"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { IAdminRegisterPayload, adminRegisterZodSchema } from "@/zod/auth.validation";

export const registerAdminAction = async (
  payload: IAdminRegisterPayload,
): Promise<{ success: true; email: string } | ApiErrorResponse> => {
  const validated = adminRegisterZodSchema.safeParse(payload);
  if (!validated.success) {
    const firstError =
      validated.error.issues[0].message || "Invalid input";
    return { success: false, message: firstError };
  }

  try {
    const { confirmPassword, ...registerData } = validated.data;

    const cleanedData = {
      ...registerData,
      website: registerData.website || undefined,
      designation: registerData.designation || undefined,
    };

    await httpClient.post("/users/create-university-admin", cleanedData);

    return { success: true, email: validated.data.email };
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