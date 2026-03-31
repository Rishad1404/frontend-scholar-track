"use server";

import {
  changeAcademicStatus,
  deleteStudent,
} from "@/services/student.services";

interface ActionResult {
  success: boolean;
  message: string;
}

export async function changeAcademicStatusAction(
  studentId: string,
  payload: { academicStatus: string },
): Promise<ActionResult> {
  try {
    const res = await changeAcademicStatus(studentId, payload);
    return { success: res.success, message: res.message };
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
        "Failed to update academic status",
    };
  }
}

export async function deleteStudentAction(
  studentId: string,
): Promise<ActionResult> {
  try {
    const res = await deleteStudent(studentId);
    return { success: res.success, message: res.message };
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
        "Failed to delete student",
    };
  }
}