/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboardLayout)/(adminRoutes)/admin/subscription/components/SubscriptionStatus.tsx
"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, CalendarClock, Building2 } from "lucide-react";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

export function SubscriptionStatus({ status }: { status: any }) {
  // Handle multiple possible field names for expiry date from backend
  const expiryDate = status?.expiresAt || status?.currentPeriodEnd || status?.validUntil || null;

  // Calculate days left from expiryDate
  let daysLeft = 0;

  if (expiryDate) {
    const endDate = new Date(expiryDate).getTime();
    const now = new Date().getTime();
    daysLeft = Math.max(
      0,
      Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border/40 bg-muted/10 p-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm"
            style={{
              background: `${BRAND.teal}15`,
              border: `1px solid ${BRAND.teal}30`,
            }}
          >
            <Zap className="h-7 w-7" style={{ color: BRAND.teal }} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              Active Subscription
            </h3>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              Your university account is fully unlocked and operational.
            </p>
          </div>
        </div>
        <span className="inline-flex self-start rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          {status?.plan || "Premium"} Plan
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 p-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Status */}
        <div className="rounded-2xl border border-border/40 bg-background p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            Account Status
          </div>
          <p className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-500" />
            {status?.status || "ACTIVE"}
          </p>
        </div>

        {/* University */}
        <div className="rounded-2xl border border-border/40 bg-background p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Building2 className="h-4 w-4" />
            University
          </div>
          <p className="truncate text-lg font-bold text-foreground">
            {status?.university?.name || "Your University"}
          </p>
        </div>

        {/* Renewal Date */}
        <div className="rounded-2xl border border-border/40 bg-background p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CalendarClock className="h-4 w-4" />
            {daysLeft > 0 ? "Renews On" : "Expired On"}
          </div>
          <p className="text-lg font-bold text-foreground">
            {expiryDate
              ? new Date(expiryDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A"}
          </p>
        </div>

        {/* Days Left */}
        <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-background p-6 shadow-sm">
          <div className="absolute -bottom-4 -right-4 opacity-10">
            <CalendarClock className="h-24 w-24" />
          </div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            Days Remaining
          </div>
          <div className="flex items-baseline gap-1">
            <p
              className="text-4xl font-black"
              style={{ color: BRAND.teal }}
            >
              {daysLeft}
            </p>
            <span className="text-sm font-medium text-muted-foreground">
              days
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}