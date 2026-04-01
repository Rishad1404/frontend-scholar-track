/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";

const BASE = "/disbursements";

// Process disbursement (change status)
export const processDisbursement = async (
  disbursementId: string,
  payload: { action: "PROCESS" | "COMPLETE" | "FAIL"; remarks?: string },
): Promise<{ success: boolean; message: string; data: any }> => {
  const res = await httpClient.patch(`${BASE}/${disbursementId}/process`, payload);
  return res as unknown as { success: boolean; message: string; data: any };
};

// Process disbursement via Stripe (change status)
export const processViaStripeAction = async (
  disbursementId: string,
  payload: { stripeAccountId: string },
): Promise<{ success: boolean; message: string; data: any }> => {
  const res = await httpClient.patch(`${BASE}/${disbursementId}/process-stripe`, payload);
  return res as unknown as { success: boolean; message: string; data: any }
};