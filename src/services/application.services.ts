/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "@/lib/axios/httpClient";
import type {
  IApplicationsListResponse,
  IApplicationDetails,
  IAiEvaluateResponse,
  IAiEvaluationView,
  IMakeDecisionResponse,
} from "@/types/application";

const BASE = "/applications";

// GET all applications (admin list)
export const getAllApplications = async (
  queryString: string,
): Promise<IApplicationsListResponse> => {
  const res = await httpClient.get(`${BASE}?${queryString}`);
  return res.data as unknown as IApplicationsListResponse;
};

// GET single application by ID
export const getApplicationById = async (
  id: string,
): Promise<{ success: boolean; data: IApplicationDetails }> => {
  const res = await httpClient.get(`${BASE}/${id}`);
  return res as unknown as { success: boolean; data: IApplicationDetails };
};

// POST — trigger AI evaluation
export const aiEvaluateApplication = async (
  id: string,
): Promise<{ success: boolean; message: string; data: IAiEvaluateResponse }> => {
  const res = await httpClient.post(`${BASE}/${id}/ai-evaluate`);
  return res as unknown as {
    success: boolean;
    message: string;
    data: IAiEvaluateResponse;
  };
};

// POST — trigger AI re-evaluation
export const aiReEvaluateApplication = async (
  id: string,
): Promise<{ success: boolean; message: string; data: IAiEvaluateResponse }> => {
  const res = await httpClient.post(`${BASE}/${id}/ai-re-evaluate`);
  return res as unknown as {
    success: boolean;
    message: string;
    data: IAiEvaluateResponse;
  };
};

// GET — get AI evaluation result
export const getAiEvaluation = async (
  id: string,
): Promise<{ success: boolean; data: IAiEvaluationView }> => {
  const res = await httpClient.get(`${BASE}/${id}/ai-evaluation`);
  return res as unknown as { success: boolean; data: IAiEvaluationView };
};


export const makeDecision = async (
  applicationId: string,
  payload: { decision: "APPROVED" | "REJECTED"; remarks?: string },
): Promise<{ success: boolean; message: string; data: IMakeDecisionResponse }> => {
  const res = await httpClient.patch(
    `${BASE}/${applicationId}/decision`,
    payload,
  );
  return res as unknown as {
    success: boolean;
    message: string;
    data: IMakeDecisionResponse;
  };
};

export const createDisbursement = async (
  applicationId: string,
): Promise<{ success: boolean; message: string; data: any }> => {
  const res = await httpClient.post(`/disbursements`, { applicationId });
  return res as unknown as {
    success: boolean;
    message: string;
    data: any;
  };
};