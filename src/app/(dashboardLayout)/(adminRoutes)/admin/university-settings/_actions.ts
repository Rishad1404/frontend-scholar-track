
"use server";

import { updateUniversity } from "@/services/university.services";

interface ActionResult {
  success: boolean;
  message: string;
}

export async function updateUniversityAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const res = await updateUniversity(id, formData);
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
        "Failed to update university",
    };
  }
}