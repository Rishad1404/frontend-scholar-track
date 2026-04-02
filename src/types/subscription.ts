// src/types/subscription.ts

export type SubscriptionPlan = "MONTHLY" | "YEARLY";
export type SubscriptionPaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface ISubscriptionPayment {
  id: string;
  universityId: string;
  adminId: string;
  plan: SubscriptionPlan;
  amount: number;
  currency: string;
  status: SubscriptionPaymentStatus;
  stripeInvoiceId: string | null;
  stripePaymentId: string | null;
  stripeCustomerId: string | null;
  paidAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  university: {
    id: string;
    name: string;
  };
  admin: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

// ─── Status Labels & Variants ───
export const PAYMENT_STATUS_LABELS: Record<SubscriptionPaymentStatus, string> = {
  COMPLETED: "Completed",
  PENDING: "Pending",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};

export const PAYMENT_STATUS_VARIANT: Record<
  SubscriptionPaymentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  COMPLETED: "default",
  PENDING: "outline",
  FAILED: "destructive",
  REFUNDED: "secondary",
};

export const PAYMENT_STATUS_COLORS: Record<SubscriptionPaymentStatus, string> = {
  COMPLETED: "#16a34a",
  PENDING: "#f59e0b",
  FAILED: "#dc2626",
  REFUNDED: "#6b7280",
};

export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

export const PLAN_COLORS: Record<SubscriptionPlan, string> = {
  MONTHLY: "#0097b2",
  YEARLY: "#4b2875",
};

export interface ISubscriptionPaymentsListResponse {
  success: boolean;
  message: string;
  data: ISubscriptionPayment[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}