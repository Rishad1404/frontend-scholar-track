// src/services/reviewer.services.ts

import { httpClient } from "@/lib/axios/httpClient";
import type {
  IReviewerListResponse,
  IReviewerSingleResponse,
} from "@/types/reviewer";
import type {
  CreateReviewerInput,
  UpdateReviewerInput,
} from "@/zod/reviewer.validation";

const BASE = "/reviewers";

export const getAllReviewers = async (
  queryString?: string
): Promise<IReviewerListResponse> => {
  const url = queryString ? `${BASE}?${queryString}` : BASE;
  const res = await httpClient.get(url);
  return res as unknown as IReviewerListResponse;
};

export const getReviewerById = async (
  id: string
): Promise<IReviewerSingleResponse> => {
  const res = await httpClient.get(`${BASE}/${id}`);
  return res as unknown as IReviewerSingleResponse;
};

export const addReviewer = async (
  data: CreateReviewerInput
): Promise<IReviewerSingleResponse> => {
  const res = await httpClient.post(BASE, data);
  return res as unknown as IReviewerSingleResponse;
};

export const updateReviewer = async (
  id: string,
  data: UpdateReviewerInput
): Promise<IReviewerSingleResponse> => {
  // backend expects { reviewer: {...} }
  const res = await httpClient.patch(`${BASE}/${id}`, {
    reviewer: data,
  });
  return res as unknown as IReviewerSingleResponse;
};

export const deleteReviewer = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.delete(`${BASE}/${id}`);
  return res as unknown as { success: boolean; message: string };
};