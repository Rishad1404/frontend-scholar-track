/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type SubscriptionStatus = {
  status: "INACTIVE" | "ACTIVE" | "EXPIRED" | "CANCELLED";
  plan?: "MONTHLY" | "YEARLY";
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  isOwner: boolean;
  university?: {
    id: string;
    name: string;
    subscriptionId?: string;
  };
  admin?: {
    id: string;
    name: string;
    email: string;
    subscriptionStatus: string;
  };
};

export type Payment = {
  id: string;
  plan: "MONTHLY" | "YEARLY";
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paidAt: string | null;
  expiresAt: string | null;
  createdAt: string;
};

export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  try {
    const response = await httpClient.get<any>("/subscriptions/status");
    
    // Log to debug what we're getting
    console.log("Subscription status response:", response);
    
    // Handle different response structures from backend
    const data = response.data || response;
    
    // The backend might return the admin object with subscriptionStatus
    // We need to normalize this to our expected structure
    return {
      status: data.status || 
              data.subscriptionStatus || 
              data.admin?.subscriptionStatus || 
              "INACTIVE",
      plan: data.plan || data.subscriptionPlan,
      currentPeriodEnd: data.currentPeriodEnd || data.expiresAt,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
      isOwner: data.isOwner || data.admin?.isOwner || false,
      university: data.university || {
        id: data.universityId || "",
        name: data.universityName || "Your University",
        subscriptionId: data.subscriptionId,
      },
      admin: data.admin,
    };
  } catch (error) {
    console.error("Failed to fetch subscription status:", error);
    // Return a default inactive status if the API fails
    return {
      status: "INACTIVE",
      isOwner: false,
      university: {
        id: "",
        name: "Your University",
      },
    };
  }
}

export async function getPaymentHistory(): Promise<Payment[]> {
  try {
    const response = await httpClient.get<any>("/subscriptions/payments");
    
    // The response might be { data: { payments: [...] } } or { payments: [...] }
    const payments = response.data?.payments ||  
                    response.data || 
                    response || 
                    [];
    
    // Ensure it's an array
    return Array.isArray(payments) ? payments : [];
  } catch (error) {
    console.error("Failed to fetch payment history:", error);
    return [];
  }
}

export async function createCheckoutSession(plan: "MONTHLY" | "YEARLY") {
  try {
    const response = await httpClient.post<any>("/subscriptions/checkout", {
      plan,
    });
    
    const data = response.data || response;
    
    // The backend should return a checkout URL
    const checkoutUrl = data.url || data.checkoutUrl || data.session?.url;
    
    if (!checkoutUrl) {
      throw new Error("No checkout URL received from server");
    }
    
    // After successful payment, the webhook will:
    // 1. Set the admin's isOwner to true
    // 2. Set subscriptionStatus to ACTIVE
    // 3. Create a SubscriptionPayment record
    
    return checkoutUrl;
  } catch (error: any) {
    console.error("Failed to create checkout session:", error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to create checkout session"
    );
  }
}

export async function cancelSubscription() {
  try {
    const response = await httpClient.post<any>("/subscriptions/cancel");
    
    // After cancellation, refresh the page
    revalidatePath("/admin/subscription");
    
    return response.data || response;
  } catch (error: any) {
    console.error("Failed to cancel subscription:", error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      "Failed to cancel subscription"
    );
  }
}

// New function to handle the return from Stripe
export async function handleStripeReturn(
  sessionId?: string,
  success?: boolean
) {
  if (success && sessionId) {
    revalidatePath("/admin/subscription");
    revalidatePath("/admin/dashboard");
    return { status: "success" };
  } 
  return { status: "failed" };
}