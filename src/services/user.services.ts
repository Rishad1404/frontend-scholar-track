/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/user.services.ts

import { httpClient } from "@/lib/axios/httpClient";
import type { IUserListResponse, IUserDetail } from "@/types/user";

const BASE = "/users";

export const getAllUsers = async (
  queryString: string
): Promise<IUserListResponse> => {
  const res = await httpClient.get(`${BASE}?${queryString}`);
  return res as unknown as IUserListResponse;
};

export const getUserById = async (
  id: string
): Promise<{ success: boolean; message: string; data: IUserDetail }> => {
  const res = await httpClient.get(`${BASE}/${id}`);
  return res as unknown as {
    success: boolean;
    message: string;
    data: IUserDetail;
  };
};

export const updateUserStatus = async (
  id: string,
  payload: { status: string }
): Promise<{ success: boolean; message: string; data: any }> => {
  const res = await httpClient.patch(`${BASE}/${id}/status`, payload);
  return res as unknown as { success: boolean; message: string; data: any };
};

export const deleteUser = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  const res = await httpClient.delete(`${BASE}/${id}`);
  return res as unknown as { success: boolean; message: string };
};