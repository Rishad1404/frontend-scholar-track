// src/app/(dashboardLayout)/(adminRoutes)/admin/departments-management/_actions.ts

"use server";

import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/services/department.services";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  type CreateDepartmentInput,
  type UpdateDepartmentInput,
} from "@/zod/department.validation";

interface ActionResult {
  success: boolean;
  message: string;
}

export async function createDepartmentAction(
  payload: CreateDepartmentInput
): Promise<ActionResult> {
  const parsed = createDepartmentSchema.safeParse(payload);

  if (!parsed.success) {
    const firstError =
      parsed.error.issues[0]?.message ?? "Validation failed";
    return { success: false, message: firstError };
  }

  try {
    const res = await createDepartment(parsed.data);
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
        "Failed to create department",
    };
  }
}

export async function updateDepartmentAction(
  id: string,
  payload: UpdateDepartmentInput
): Promise<ActionResult> {
  const parsed = updateDepartmentSchema.safeParse(payload);

  if (!parsed.success) {
    const firstError =
      parsed.error.issues[0]?.message ?? "Validation failed";
    return { success: false, message: firstError };
  }

  try {
    const res = await updateDepartment(id, parsed.data);
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
        "Failed to update department",
    };
  }
}

export async function deleteDepartmentAction(
  id: string
): Promise<ActionResult> {
  try {
    const res = await deleteDepartment(id);
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
        "Failed to delete department",
    };
  }
}