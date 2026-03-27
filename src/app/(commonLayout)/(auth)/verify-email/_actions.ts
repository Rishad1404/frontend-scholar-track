"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { ApiErrorResponse } from "@/types/api.types";
import { redirect } from "next/navigation";

export const verifyEmailAction = async (
  email: string,
  otp: string,
): Promise<{ success: true } | ApiErrorResponse> => {
  if (!email || !otp) {
    return { success: false, message: "Email and OTP are required" };
  }

  try {
    await httpClient.post("/auth/verify-email", { email, otp });

    redirect("/login");
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    return {
      success: false,
      message:
        axiosError?.response?.data?.message ||
        axiosError?.message ||
        "Verification failed",
    };
  }
};

export const resendOtpAction = async (
  email: string,
): Promise<{ success: true; message: string } | ApiErrorResponse> => {
  if (!email) {
    return { success: false, message: "Email is required" };
  }

  try {
    const response = await httpClient.post<{ message: string }>(
      "/auth/resend-otp",
      { email },
    );

    return {
      success: true,
      message: response.data?.message || "OTP sent successfully",
    };
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
        "Failed to resend OTP",
    };
  }
};