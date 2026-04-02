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


export const createApplication = async (payload: {
  scholarshipId: string;
  essay?: string;
  financialInfo?: Record<string, string>;
}): Promise<{ success: boolean; data: any; message: string }> => {
  const res = await httpClient.post(BASE, payload);
  return res as unknown as { success: boolean; data: any; message: string };
};

export const updateApplication = async (
  applicationId: string,
  payload: {
    essay?: string;
    financialInfo?: Record<string, string>;
  }
): Promise<{ success: boolean; data: any; message: string }> => {
  const res = await httpClient.patch(`${BASE}/${applicationId}`, payload);
  return res as unknown as { success: boolean; data: any; message: string };
};

export const uploadDocument = async (
  applicationId: string,
  formData: FormData
): Promise<{ success: boolean; data: any; message: string }> => {
  const res = await httpClient.post(
    `${BASE}/${applicationId}/documents`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res as unknown as { success: boolean; data: any; message: string };
};

export const removeDocument = async (
  applicationId: string,
  documentId: string
): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.delete(
    `${BASE}/${applicationId}/documents/${documentId}`
  );
  return res as unknown as { success: boolean; message: string };
};

export const submitApplication = async (
  applicationId: string
): Promise<{ success: boolean; data: any; message: string }> => {
  const res = await httpClient.patch(`${BASE}/${applicationId}/submit`);
  return res as unknown as { success: boolean; data: any; message: string };
};

export const deleteApplication = async (
  applicationId: string
): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.delete(`${BASE}/${applicationId}`);
  return res as unknown as { success: boolean; message: string };
};

export const getMyApplications = async (
  queryString?: string
): Promise<{ success: boolean; data: any; meta?: any }> => {
  const url = queryString ? `${BASE}/my-applications?${queryString}` : `${BASE}/my-applications`;
  const res = await httpClient.get(url);
  return res as unknown as { success: boolean; data: any; meta?: any };
};


export const uploadStudentDocument = async (
  applicationId: string,
  formData: FormData
): Promise<{ success: boolean; data: any; message: string }> => {
  const res = await httpClient.post(
    `${BASE}/${applicationId}/documents`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res as unknown as { success: boolean; data: any; message: string };
};
