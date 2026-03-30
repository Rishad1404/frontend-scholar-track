
"use server";

import {
  createAcademicTerm,
  deleteAcademicTerm,
} from "@/services/academicTerm.services";
import {
  createAcademicTermSchema,
  type CreateAcademicTermInput,
} from "@/zod/academicTerm.validation";

interface ActionResult {
  success: boolean;
  message: string;
}

export async function createAcademicTermAction(
  payload: CreateAcademicTermInput
): Promise<ActionResult> {
  const parsed = createAcademicTermSchema.safeParse(payload);

  if (!parsed.success) {
    const firstError =
      parsed.error.issues[0]?.message ?? "Validation failed";
    return { success: false, message: firstError };
  }

  try {
    const res = await createAcademicTerm(parsed.data);
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
        "Failed to create academic term",
    };
  }
}

export async function deleteAcademicTermAction(
  id: string
): Promise<ActionResult> {
  try {
    const res = await deleteAcademicTerm(id);
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
        "Failed to delete academic term",
    };
  }
}