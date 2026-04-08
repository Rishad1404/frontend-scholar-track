/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import {
  updateUniversityStatus,
  deleteUniversity,
  updateUniversity,
} from "@/services/university.services";
import { revalidatePath } from "next/cache";

export async function changeUniversityStatusAction(
  id: string,
  payload: { status: string }
) {
  try {
    const res = await updateUniversityStatus(id, payload);
    return {
      success: true,
      message: res.message || "Status updated successfully",
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to update university status",
      data: null,
    };
  }
}

export async function deleteUniversityAction(id: string) {
  try {
    const res = await deleteUniversity(id);
    return {
      success: true,
      message: res.message || "University deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to delete university",
    };
  }
}


export async function updateUniversityAction(
  universityId: string,
  formData: FormData,
) {
  try {
    const result = await updateUniversity(universityId, formData);

    revalidatePath("/super-admin/universities-management");
    revalidatePath(`/super-admin/universities-management/${universityId}`);

    return {
      success: true,
      message: result?.message ?? "University updated successfully.",
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update university.";
    return {
      success: false,
      message,
    };
  }
}