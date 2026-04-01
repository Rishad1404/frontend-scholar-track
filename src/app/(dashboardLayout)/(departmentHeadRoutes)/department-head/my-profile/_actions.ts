/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { updateDepartmentHead } from "@/services/departmentHead.services";
import type { UpdateDepartmentHeadInput } from "@/zod/departmentHead.validation";
import { revalidatePath } from "next/cache";

export async function updateDepartmentHeadAction(
  deptHeadId: string,
  payload: UpdateDepartmentHeadInput
) {
  try {
    await updateDepartmentHead(deptHeadId, payload);
    revalidatePath("/department-head/my-profile");
    return { success: true, message: "Profile updated successfully!" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to update profile",
    };
  }
}