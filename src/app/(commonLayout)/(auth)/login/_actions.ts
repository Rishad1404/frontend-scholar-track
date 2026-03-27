/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  getDefaultDashboardRoute,
  isValidRedirectForRole,
  UserRole,
} from "@/lib/authUtils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginResponse } from "@/types/auth.types";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string,
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsedPayload = loginZodSchema.safeParse(payload);
  if (!parsedPayload.success) {
    const firstError = parsedPayload.error.issues[0].message || "Invalid Input";
    return {
      success: false,
      message: firstError, 
    };
  }

  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsedPayload.data,
    );

    const { accessToken, refreshToken, token, user } = response.data as any;
    const role = user.role as UserRole;

    await setTokenInCookies("accessToken", accessToken);
    if (refreshToken) {
      await setTokenInCookies("refreshToken", refreshToken);
    }
    if (token) {
      await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60);
    }

    const targetPath =
      redirectPath && isValidRedirectForRole(redirectPath, role)
        ? redirectPath
        : getDefaultDashboardRoute(role);

    redirect(targetPath);
  } catch (error: any) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    if (error?.response?.data?.message === "Email not verified") {
      redirect(`/verify-email?email=${payload.email}`);
    }

    return {
      success: false,
      message: error?.response?.data?.message || `Login Failed: ${error.message}`,
    };
  }
};
