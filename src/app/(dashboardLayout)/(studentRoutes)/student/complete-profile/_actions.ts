/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { completeProfile } from "@/services/student.services";
import { revalidatePath } from "next/cache";

export async function completeProfileAction(payload: {
  universityId: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup?: string;
  phone?: string;
  address?: string;
}) {
  try {
    await completeProfile(payload);
    revalidatePath("/student/my-profile");
    revalidatePath("/student/complete-profile");
    return { success: true, message: "Profile completed successfully!" };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to complete profile",
    };
  }
}