/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import {
  completeAcademicInfo,
  updateAcademicInfo,
} from "@/services/student.services";
import { revalidatePath } from "next/cache";

export async function completeAcademicInfoAction(payload: {
  departmentId: string;
  levelId: string;
  termId: string;
  studentIdNo: string;
  gpa: number;
  cgpa: number;
  creditHoursCompleted?: number;
}) {
  try {
    await completeAcademicInfo(payload);
    revalidatePath("/student/academic-info");
    revalidatePath("/student/my-profile");
    return { success: true, message: "Academic info completed successfully!" };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to complete academic info",
    };
  }
}

export async function updateAcademicInfoAction(payload: {
  academicInfo: {
    departmentId?: string;
    levelId?: string;
    termId?: string;
    studentIdNo?: string;
    gpa?: number;
    cgpa?: number;
    creditHoursCompleted?: number;
  };
}) {
  try {
    await updateAcademicInfo(payload);
    revalidatePath("/student/academic-info");
    revalidatePath("/student/my-profile");
    return { success: true, message: "Academic info updated successfully!" };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to update academic info",
    };
  }
}