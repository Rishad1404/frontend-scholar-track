/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { screenApplication } from "@/services/screening.services";
import { revalidatePath } from "next/cache";

export async function screenApplicationAction(
  applicationId: string,
  payload: { passed: boolean; comment?: string }
) {
  try {
    await screenApplication(applicationId, payload);
    revalidatePath("/department-head/screening");
    return {
      success: true,
      message: payload.passed
        ? "Application passed screening successfully!"
        : "Application rejected successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to screen application",
    };
  }
}