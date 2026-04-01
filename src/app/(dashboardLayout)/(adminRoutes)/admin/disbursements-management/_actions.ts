/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboardLayout)/(adminRoutes)/admin/disbursements-management/_actions.ts

"use server";
import { httpClient } from "@/lib/axios/httpClient";
import { processDisbursement } from "@/services/disbursement.services";

interface IApiResponse {
  message?: string;
  data?: unknown;
}

export async function processDisbursementAction(
  disbursementId: string,
  payload: { action: "PROCESS" | "COMPLETE" | "FAIL"; remarks?: string },
) {
  try {
    const res = await processDisbursement(disbursementId, payload);
    return {
      success: true,
      message: res.message || `Successfully marked as ${payload.action}`,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to process disbursement",
    };
  }
}

// ─── NEW: Stripe Processing Action ───
export async function processViaStripeAction(
  id: string,
  payload: { stripeAccountId: string },
) {
  try {
    // 🚨 FIX: Pass <IApiResponse> to the post request
    const res = await httpClient.post<IApiResponse>(
      `/disbursements/${id}/process-stripe`,
      payload,
    );
    return {
      success: true,
      message: res.data.message || "Stripe transfer initiated successfully",
    };
  } catch (error: any) {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    return {
      success: false,
      message: error?.response?.data?.message || "Stripe transfer failed",
    };
  }
}
