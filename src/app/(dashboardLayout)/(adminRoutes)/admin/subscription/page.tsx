/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboardLayout)/(adminRoutes)/admin/subscription/page.tsx
import {
  getSubscriptionStatus,
  getPaymentHistory,
} from "@/services/subscription.service";

import { Crown, Loader2 } from "lucide-react";
import { AlertBanner } from "@/components/modules/Admin/subscription/AlertBanner";
import { PricingCard } from "@/components/modules/Admin/subscription/PricingCard";
import { SubscriptionStatus } from "@/components/modules/Admin/subscription/SubscriptionStatus";
import { PaymentHistory } from "@/components/modules/Admin/subscription/PaymentHistory";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  // ✅ Await searchParams (Next.js 15+)
  const params = await searchParams;

  // Fetch data server-side using httpClient
  const [statusResponse, paymentsResponse] = await Promise.all([
    getSubscriptionStatus(),
    getPaymentHistory(),
  ]);

  // ✅ Extract data properly from your API response wrapper
  // Your backend returns: { success: true, data: { status, plan, ... } }
  const status = (statusResponse as any)?.data || statusResponse || null;
  const payments =
    (paymentsResponse as any)?.data?.data ||
    (paymentsResponse as any)?.data ||
    paymentsResponse ||
    [];

  // Debug log to see what we got
  console.log("=== SUBSCRIPTION PAGE DEBUG ===");
  console.log("Status:", JSON.stringify(status, null, 2));
  console.log("Payments:", JSON.stringify(payments, null, 2));
  console.log("===============================");

  // Determine subscription state - handle case sensitivity and null safety
  const subscriptionStatus = (status?.status || "INACTIVE").toUpperCase();
  const isActive = subscriptionStatus === "ACTIVE";
  const isExpired = subscriptionStatus === "EXPIRED";
  const isCancelled = subscriptionStatus === "CANCELLED";
  const isInactive = subscriptionStatus === "INACTIVE";
  const needsSubscription = isInactive || isExpired || isCancelled;
  
  // Ensure status has the correct format for child components
  const normalizedStatus = {
    ...status,
    status: subscriptionStatus, // Ensure status is uppercase
    expiresAt: status?.expiresAt || status?.currentPeriodEnd || null, // Handle both field names
  };

  // Normalize payments to array
  const paymentsList = Array.isArray(payments)
    ? payments
    : payments?.payments || payments?.data || [];

  return (
    <div className="mx-auto max-w-5xl py-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Subscription & Billing
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your university&apos;s ScholarTrack plan.
          </p>
        </div>

        {isActive && (
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-600 dark:text-amber-500">
            <Crown className="h-4 w-4" />
            Account Owner
          </div>
        )}
      </div>

      {/* ✅ Alerts - using awaited params */}
      {(params.success || params.canceled) && (
        <AlertBanner
          success={params.success === "true"}
          canceled={params.canceled === "true"}
        />
      )}

      {/* ✅ Show pricing if needs subscription */}
      {needsSubscription && <PricingCard currentStatus={status} />}

      {/* ✅ Show active status if active */}
      {isActive && <SubscriptionStatus status={status} />}

      {/* ✅ Always show payment history if available */}
      {paymentsList.length > 0 && (
        <PaymentHistory payments={paymentsList} />
      )}
    </div>
  );
}