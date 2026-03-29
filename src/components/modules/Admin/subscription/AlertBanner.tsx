// app/(dashboardLayout)/admin/subscription/components/AlertBanner.tsx
"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function AlertBanner({
  success,
  canceled,
}: {
  success?: boolean;
  canceled?: boolean;
}) {
  if (!success && !canceled) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`relative overflow-hidden flex items-center gap-4 rounded-2xl border p-5 shadow-lg backdrop-blur-md ${
        success
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          : "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400"
      }`}
    >
      {/* Left glowing accent line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${success ? "bg-emerald-500" : "bg-rose-500"}`} />

      {success ? (
        <>
          <CheckCircle2 className="h-7 w-7 shrink-0" />
          <div>
            <h4 className="text-base font-bold">Payment Successful!</h4>
            <p className="text-sm opacity-90 mt-0.5">Your university account is now fully active. You have full access to all features.</p>
          </div>
        </>
      ) : (
        <>
          <AlertCircle className="h-7 w-7 shrink-0" />
          <div>
            <h4 className="text-base font-bold">Checkout Canceled</h4>
            <p className="text-sm opacity-90 mt-0.5">The payment process was interrupted. Your account remains inactive.</p>
          </div>
        </>
      )}
    </motion.div>
  );
}