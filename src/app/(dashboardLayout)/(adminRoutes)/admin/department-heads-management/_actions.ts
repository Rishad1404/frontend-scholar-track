// src/app/(dashboardLayout)/(adminRoutes)/admin/department-heads-management/_actions.ts

"use server";

import {
  updateDepartmentHead,
  deleteDepartmentHead,
} from "@/services/departmentHead.services";
import {
  updateDepartmentHeadSchema,
  type UpdateDepartmentHeadInput,
} from "@/zod/departmentHead.validation";

interface ActionResult {
  success: boolean;
  message: string;
}

export async function updateDepartmentHeadAction(
  id: string,
  payload: UpdateDepartmentHeadInput
): Promise<ActionResult> {
  const parsed = updateDepartmentHeadSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Validation failed",
    };
  }

  const hasAnyValue = Object.values(parsed.data).some(
    (v) => v !== undefined && v !== ""
  );
  if (!hasAnyValue) {
    return { success: false, message: "No data provided to update" };
  }

  try {
    const res = await updateDepartmentHead(id, parsed.data);
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
        "Failed to update department head",
    };
  }
}

export async function deleteDepartmentHeadAction(
  id: string
): Promise<ActionResult> {
  try {
    const res = await deleteDepartmentHead(id);
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
        "Failed to delete department head",
    };
  }
}