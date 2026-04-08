/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(dashboardLayout)/(superAdminRoutes)/super-admin/users-management/_actions.ts

"use server";

import { updateUserStatus, deleteUser } from "@/services/user.services";

export async function changeUserStatusAction(
  id: string,
  payload: { status: string }
) {
  try {
    const res = await updateUserStatus(id, payload);
    return {
      success: true,
      message: res.message || "Status updated successfully",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to update user status",
      data: null,
    };
  }
}

export async function deleteUserAction(id: string) {
  try {
    const res = await deleteUser(id);
    return {
      success: true,
      message: res.message || "User deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to delete user",
    };
  }
}