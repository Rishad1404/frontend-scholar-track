/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboardLayout)/(adminRoutes)/admin/subscription/components/PricingCard.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/services/subscription.service";
import { ShieldCheck, CreditCard, Loader2 } from "lucide-react";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

export function PricingCard({ currentStatus }: { currentStatus: any }) {
  const [isYearly, setIsYearly] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      const plan = isYearly ? "YEARLY" : "MONTHLY";
      const response: any = await createCheckoutSession(plan);

      const checkoutUrl =
        response?.data?.url ||
        response?.url ||
        response?.data?.data?.url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        console.error("No checkout URL in response:", response);
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to initiate checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const statusLabel = (currentStatus?.status || "INACTIVE").toUpperCase();

  // Only show pricing card if subscription is not active
  if (statusLabel === "ACTIVE") {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/60 shadow-xl backdrop-blur-xl"
    >
      <div
        className="absolute -right-32 -top-32 h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{ background: BRAND.teal }}
      />
      <div
        className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{ background: BRAND.purple }}
      />

      <div className="relative p-8 text-center sm:p-12">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: `${BRAND.purple}15` }}
        >
          <ShieldCheck className="h-8 w-8" style={{ color: BRAND.purple }} />
        </div>

        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          {statusLabel === "EXPIRED"
            ? "Renew Your Subscription"
            : statusLabel === "CANCELLED"
              ? "Reactivate Your Subscription"
              : "Activate Your University"}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Your account is currently{" "}
          <strong className="text-rose-500">{statusLabel}</strong>.{" "}
          {statusLabel === "EXPIRED"
            ? "Renew to regain full access."
            : statusLabel === "CANCELLED"
              ? "Resubscribe to unlock all features."
              : "Activate your subscription to publish scholarships."}
        </p>

        {/* Plan Toggle */}
        <div className="mt-8 flex justify-center">
          <div className="relative inline-flex items-center rounded-full border border-border/40 bg-background/50 p-1 shadow-sm">
            <button
              onClick={() => setIsYearly(false)}
              className={`relative z-10 w-32 rounded-full py-2.5 text-sm font-semibold transition-colors ${
                !isYearly ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`relative z-10 w-32 rounded-full py-2.5 text-sm font-semibold transition-colors ${
                isYearly ? "text-white" : "text-muted-foreground"
              }`}
            >
              Yearly
            </button>
            <motion.div
              layout
              animate={{ x: isYearly ? "100%" : "0%" }}
              transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
              className="absolute bottom-1 left-1 top-1 w-32 rounded-full shadow-sm"
              style={{
                background: isYearly
                  ? `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`
                  : "var(--card)",
                border: isYearly ? "none" : "1px solid var(--border)",
              }}
            />
          </div>
        </div>

        {/* Save Badge for Yearly */}
        {isYearly && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400"
          >
            Save ৳2,000 per year — 2 months free!
          </motion.p>
        )}

        {/* Price */}
        <div className="mb-10 mt-8 flex items-baseline justify-center text-foreground">
          <span className="text-5xl font-black tracking-tight">
            ৳{isYearly ? "9,999" : "999"}
          </span>
          <span className="ml-2 text-base font-medium text-muted-foreground">
            / {isYearly ? "year" : "month"}
          </span>
        </div>

        {/* Subscribe Button */}
        <Button
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="h-14 w-full max-w-md rounded-2xl text-[15px] font-bold text-white shadow-lg transition-all hover:scale-[1.02]"
          style={{
            background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
            boxShadow: `0 8px 24px ${BRAND.teal}40`,
          }}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Connecting to Stripe...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Proceed to Checkout
            </>
          )}
        </Button>

        <p className="mt-4 text-xs text-muted-foreground">
          Secure payment powered by Stripe. Cancel anytime.
        </p>
      </div>
    </motion.div>
  );
}