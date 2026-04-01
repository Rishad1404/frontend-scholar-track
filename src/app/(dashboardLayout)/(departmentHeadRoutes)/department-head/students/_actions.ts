/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboardLayout)/(deptHeadRoutes)/department-head/students/_actions/index.ts

"use server";

import { changeAcademicStatus } from "@/services/student.services";
import {  StudentAcademicStatus } from "@/types/student";
import { revalidatePath } from "next/cache";

export async function changeAcademicStatusAction(
  studentId: string,
  academicStatus: StudentAcademicStatus
) {
  try {
    await changeAcademicStatus(studentId, { academicStatus });
    revalidatePath("/department-head/students");
    return { success: true, message: "Academic status updated successfully!" };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to update academic status",
    };
  }
}