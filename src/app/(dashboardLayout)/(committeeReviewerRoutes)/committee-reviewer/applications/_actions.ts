/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";

interface IReviewPayload {
  gpaScore: number;
  essayScore: number;
  financialScore: number;
  criteriaScore: number;
  notes?: string;
}

interface IApiResponse {
  message?: string;
  data?: unknown;
}

export async function submitReviewAction(applicationId: string, payload: IReviewPayload) {
  try {
    const res = await httpClient.post<IApiResponse>(`/applications/${applicationId}/review`, payload);
    return { success: true, message: res.data.message || "Review submitted successfully" };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to submit review" };
  }
}

export async function updateReviewAction(applicationId: string, payload: Partial<IReviewPayload>) {
  try {
    const res = await httpClient.patch<IApiResponse>(`/applications/${applicationId}/review`, payload);
    return { success: true, message: res.data.message || "Review updated successfully" };
  } catch (error: any) {
    return { success: false, message: error?.response?.data?.message || "Failed to update review" };
  }
}