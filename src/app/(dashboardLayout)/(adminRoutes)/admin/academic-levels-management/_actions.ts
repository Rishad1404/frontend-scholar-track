
"use server";

import {
  createAcademicLevel,
  deleteAcademicLevel,
} from "@/services/academicLevel.services";
import {
  createAcademicLevelSchema,
  type CreateAcademicLevelInput,
} from "@/zod/academicLevel.validation";

interface ActionResult {
  success: boolean;
  message: string;
}

export async function createAcademicLevelAction(
  payload: CreateAcademicLevelInput
): Promise<ActionResult> {
  const parsed = createAcademicLevelSchema.safeParse(payload);

  if (!parsed.success) {
    const firstError =
      parsed.error.issues[0]?.message ?? "Validation failed";
    return { success: false, message: firstError };
  }

  try {
    const res = await createAcademicLevel(parsed.data);
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
        "Failed to create academic level",
    };
  }
}

export async function deleteAcademicLevelAction(
  id: string
): Promise<ActionResult> {
  try {
    const res = await deleteAcademicLevel(id);
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
        "Failed to delete academic level",
    };
  }
}