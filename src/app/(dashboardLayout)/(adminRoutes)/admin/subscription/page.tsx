/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboardLayout)/(adminRoutes)/admin/subscription/page.tsx
import {
  getSubscriptionStatus,
  getPaymentHistory,
} from "@/services/subscription.services";

import { Crown } from "lucide-react";
import { AlertBanner } from "@/components/modules/Admin/subscription/AlertBanner";
import { PricingCard } from "@/components/modules/Admin/subscription/PricingCard";
import { SubscriptionStatus } from "@/components/modules/Admin/subscription/SubscriptionStatus";
import { PaymentHistory } from "@/components/modules/Admin/subscription/PaymentHistory";

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const params = await searchParams;

  const [statusResponse, paymentsResponse] = await Promise.all([
    getSubscriptionStatus(),
    getPaymentHistory(),
  ]);

  const status = (statusResponse as any)?.data || statusResponse || null;
  const payments =
    (paymentsResponse as any)?.data?.data ||
    (paymentsResponse as any)?.data ||
    paymentsResponse ||
    [];

  const subscriptionStatus = (status?.status || "INACTIVE").toUpperCase();
  const isActive = subscriptionStatus === "ACTIVE";
  const isExpired = subscriptionStatus === "EXPIRED";
  const isCancelled = subscriptionStatus === "CANCELLED";
  const isInactive = subscriptionStatus === "INACTIVE";
  const needsSubscription = isInactive || isExpired || isCancelled;
  
  const paymentsList = Array.isArray(payments)
    ? payments
    : payments?.payments || payments?.data || [];

  return (
    <div className="relative mx-auto max-w-6xl py-8 px-4 sm:px-6 lg:px-8 min-h-[80vh]">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border/40 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Subscription & Billing
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-2xl">
            Manage your university&apos;s ScholarTrack plan, view payment history, and monitor your account limits.
          </p>
        </div>

        {isActive && (
          <div className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-600 shadow-sm dark:text-amber-500">
            <Crown className="h-4 w-4" />
            Account Owner
          </div>
        )}
      </div>

      <div className="space-y-8">
        {(params.success || params.canceled) && (
          <AlertBanner
            success={params.success === "true"}
            canceled={params.canceled === "true"}
          />
        )}

        {needsSubscription && <PricingCard currentStatus={status} />}
        {isActive && <SubscriptionStatus status={status} />}
        {paymentsList.length > 0 && <PaymentHistory payments={paymentsList} />}
      </div>
    </div>
  );
}