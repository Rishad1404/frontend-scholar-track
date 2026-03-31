// src/app/(dashboardLayout)/(adminRoutes)/admin/reviewers-management/_actions.ts

"use server";

import { addReviewer, deleteReviewer, updateReviewer } from "@/services/reviewer.services";
import {
  createReviewerSchema,
  updateReviewerSchema,
  type CreateReviewerInput,
  type UpdateReviewerInput,
} from "@/zod/reviewer.validation";

interface ActionResult {
  success: boolean;
  message: string;
}

export async function createReviewerAction(
  payload: CreateReviewerInput
): Promise<ActionResult> {
  const parsed = createReviewerSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  try {
    const res = await addReviewer(parsed.data);
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
        "Failed to create reviewer",
    };
  }
}

export async function updateReviewerAction(
  id: string,
  payload: UpdateReviewerInput
): Promise<ActionResult> {
  const parsed = updateReviewerSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  const hasAnyValue = Object.values(parsed.data).some((value) => value !== undefined);
  if (!hasAnyValue) {
    return {
      success: false,
      message: "No data provided to update",
    };
  }

  try {
    const res = await updateReviewer(id, parsed.data);
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
        "Failed to update reviewer",
    };
  }
}

export async function deleteReviewerAction(id: string): Promise<ActionResult> {
  try {
    const res = await deleteReviewer(id);
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
        "Failed to delete reviewer",
    };
  }
}