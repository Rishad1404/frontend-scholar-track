"use server";

import {
  createScholarship,
  updateScholarship,
  changeScholarshipStatus,
  deleteScholarship,
} from "@/services/scholarship.services";

interface ActionResult {
  success: boolean;
  message: string;
}

export async function createScholarshipAction(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const res = await createScholarship(formData);
    return { success: true, message: res.message };
  } catch (error) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return {
      success: false,
      message:
        err?.response?.data?.message ??
        err?.message ??
        "Failed to create scholarship",
    };
  }
}

export async function updateScholarshipAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const res = await updateScholarship(id, formData);
    return { success: true, message: res.message };
  } catch (error) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return {
      success: false,
      message:
        err?.response?.data?.message ??
        err?.message ??
        "Failed to update scholarship",
    };
  }
}

export async function changeScholarshipStatusAction(
  id: string,
  payload: { status: string },
): Promise<ActionResult> {
  try {
    const res = await changeScholarshipStatus(id, payload);
    return { success: true, message: res.message };
  } catch (error) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return {
      success: false,
      message:
        err?.response?.data?.message ??
        err?.message ??
        "Failed to update status",
    };
  }
}

export async function deleteScholarshipAction(
  id: string,
): Promise<ActionResult> {
  try {
    const res = await deleteScholarship(id);
    return { success: true, message: res.message };
  } catch (error) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    return {
      success: false,
      message:
        err?.response?.data?.message ??
        err?.message ??
        "Failed to delete scholarship",
    };
  }
}