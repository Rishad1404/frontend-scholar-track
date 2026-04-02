/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import {
  updateStudentProfile,
  uploadStudentProfilePhoto,
} from "@/services/student.services";
import { revalidatePath } from "next/cache";

export async function updateStudentProfileAction(payload: {
  student: { name?: string; phone?: string; address?: string; gender?: string };
}) {
  try {
    await updateStudentProfile(payload);
    revalidatePath("/student/my-profile");
    return { success: true, message: "Profile updated successfully!" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to update profile",
    };
  }
}

export async function uploadStudentPhotoAction(formData: FormData) {
  try {
    await uploadStudentProfilePhoto(formData);
    revalidatePath("/student/my-profile");
    return { success: true, message: "Photo uploaded successfully!" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to upload photo",
    };
  }
}
