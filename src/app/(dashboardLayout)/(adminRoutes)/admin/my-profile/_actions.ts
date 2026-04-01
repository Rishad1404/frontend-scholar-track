// app/(dashboardLayout)/(adminRoutes)/admin/my-profile/_actions/index.ts

"use server";

import { updateAdminProfile } from "@/services/admin.services";
import { revalidatePath } from "next/cache";

interface ActionResult {
  success: boolean;
  message: string;
}

export async function updateAdminAction(
  adminId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    await updateAdminProfile(adminId, formData);
    revalidatePath("/admin/my-profile");
    return { success: true, message: "Profile updated successfully!" };
  } catch (error: unknown) {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to update profile";
    return { success: false, message };
  }
}