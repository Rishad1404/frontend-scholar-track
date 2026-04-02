/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboardLayout)/(studentRoutes)/student/scholarships/[scholarshipId]/apply/_actions/index.ts

"use server";

import {
  createApplication,
  updateApplication,
  removeDocument,
  submitApplication,
  deleteApplication,
  uploadStudentDocument,
} from "@/services/application.services";
import { revalidatePath } from "next/cache";

export async function createApplicationAction(payload: {
  scholarshipId: string;
  essay?: string;
  financialInfo?: Record<string, string>;
}) {
  try {
    const res = await createApplication(payload);
    return { success: true, message: "Draft created!", data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to create application",
      data: null,
    };
  }
}

export async function updateApplicationAction(
  applicationId: string,
  payload: { essay?: string; financialInfo?: Record<string, string> }
) {
  try {
    const res = await updateApplication(applicationId, payload);
    return { success: true, message: "Application updated!", data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to update application",
      data: null,
    };
  }
}

export async function uploadDocumentAction(
  applicationId: string,
  formData: FormData
) {
  try {
    const res = await uploadStudentDocument(applicationId, formData);
    return { success: true, message: "Document uploaded!", data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to upload document",
      data: null,
    };
  }
}

export async function removeDocumentAction(
  applicationId: string,
  documentId: string
) {
  try {
    await removeDocument(applicationId, documentId);
    return { success: true, message: "Document removed!" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to remove document",
    };
  }
}

export async function submitApplicationAction(applicationId: string) {
  try {
    await submitApplication(applicationId);
    revalidatePath("/student/scholarships");
    revalidatePath("/student/my-applications");
    return { success: true, message: "Application submitted successfully!" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to submit application",
    };
  }
}

export async function deleteApplicationAction(applicationId: string) {
  try {
    await deleteApplication(applicationId);
    return { success: true, message: "Application deleted!" };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to delete application",
    };
  }
}