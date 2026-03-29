/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboardLayout)/(adminRoutes)/admin/subscription/components/SubscriptionStatus.tsx
"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, CalendarClock, Building2 } from "lucide-react";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

export function SubscriptionStatus({ status }: { status: any }) {
  const expiryDate = status?.expiresAt || status?.currentPeriodEnd || status?.validUntil || null;
  let daysLeft = 0;

  if (expiryDate) {
    const endDate = new Date(expiryDate).getTime();
    const now = new Date().getTime();
    daysLeft = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm"
    >
      {/* Top Banner Area */}
      <div className="flex flex-col gap-4 border-b border-border/40 bg-muted/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
            }}
          >
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              Active Subscription
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Your university operations are fully unlocked.
            </p>
          </div>
        </div>
        <span className="inline-flex self-start sm:self-auto items-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400">
          {status?.plan || "Premium"} Plan
        </span>
      </div>

      {/* Stats Grid - All cards use flex-col & justify-between for perfect alignment */}
      <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Status */}
        <div className="flex h-full flex-col justify-between rounded-xl border border-border/50 bg-background/50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-3">
            <ShieldCheck className="h-4 w-4 shrink-0" /> Account Status
          </div>
          <p className="flex items-center gap-2.5 text-lg font-bold text-foreground uppercase tracking-tight">
            <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            {status?.status || "ACTIVE"}
          </p>
        </div>

        {/* University - Uses line-clamp-2 to handle long names gracefully */}
        <div className="flex h-full flex-col justify-between rounded-xl border border-border/50 bg-background/50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-3">
            <Building2 className="h-4 w-4 shrink-0" /> Licensed To
          </div>
          <p className="line-clamp-2 text-lg font-bold leading-tight text-foreground">
            {status?.university?.name || "Your University"}
          </p>
        </div>

        {/* Renewal Date */}
        <div className="flex h-full flex-col justify-between rounded-xl border border-border/50 bg-background/50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-3">
            <CalendarClock className="h-4 w-4 shrink-0" /> {daysLeft > 0 ? "Renews On" : "Expired On"}
          </div>
          <p className="text-lg font-bold text-foreground">
            {expiryDate
              ? new Date(expiryDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "N/A"}
          </p>
        </div>

        {/* Days Left */}
        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border/50 bg-background/50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1 relative z-10">
            Days Remaining
          </div>
          <div className="flex items-baseline gap-1.5 relative z-10">
            <p className="text-3xl font-black" style={{ color: BRAND.teal }}>
              {daysLeft}
            </p>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              days
            </span>
          </div>
        </div>
        
      </div>
    </motion.div>
  );
}