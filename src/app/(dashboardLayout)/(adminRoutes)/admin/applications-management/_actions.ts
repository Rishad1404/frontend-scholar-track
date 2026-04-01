"use server";

import {
  aiEvaluateApplication,
  aiReEvaluateApplication,
  makeDecision,
} from "@/services/application.services";

interface ActionResult {
  success: boolean;
  message: string;
}

export async function aiEvaluateAction(
  applicationId: string,
): Promise<ActionResult> {
  try {
    const res = await aiEvaluateApplication(applicationId);
    return { success: true, message: res.message || "AI evaluation completed" };
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
        "Failed to run AI evaluation",
    };
  }
}

export async function aiReEvaluateAction(
  applicationId: string,
): Promise<ActionResult> {
  try {
    const res = await aiReEvaluateApplication(applicationId);
    return {
      success: true,
      message: res.message || "AI re-evaluation completed",
    };
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
        "Failed to run AI re-evaluation",
    };
  }
}

export async function makeDecisionAction(
  applicationId: string,
  payload: { decision: "APPROVED" | "REJECTED"; remarks?: string },
): Promise<ActionResult> {
  try {
    const res = await makeDecision(applicationId, payload);
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
        "Failed to make decision",
    };
  }
}