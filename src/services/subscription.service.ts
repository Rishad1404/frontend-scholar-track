/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/subscription.service.ts
"use server";

import { httpClient } from "@/lib/axios/httpClient";

export async function getSubscriptionStatus() {
  try {
    const response = await httpClient.get("/subscriptions/status");
    return response;
  } catch (error) {
    console.error("Status fetch failed:", error);
    return null;
  }
}

export async function getPaymentHistory() {
  try {
    const response = await httpClient.get("/subscriptions/payments");
    return response;
  } catch (error) {
    console.error("Payment history fetch failed:", error);
    return null;
  }
}

export async function createCheckoutSession(plan: "MONTHLY" | "YEARLY") {
  try {
    const response = await httpClient.post("/subscriptions/checkout", { plan });
    return response;
  } catch (error: any) {
    console.error("Checkout error:", error);
    throw error;
  }
}

export async function cancelSubscription() {
  try {
    const response = await httpClient.post("/subscriptions/cancel");
    return response;
  } catch (error) {
    console.error("Cancel error:", error);
    throw error;
  }
}
