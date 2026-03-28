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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-8 flex items-center gap-3 rounded-2xl border p-4 text-sm font-semibold ${
        success
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400"
      }`}
    >
      {success ? (
        <>
          <CheckCircle2 className="h-5 w-5" />
          <p>Payment successful! Your university account is now fully active.</p>
        </>
      ) : (
        <>
          <AlertCircle className="h-5 w-5" />
          <p>Checkout was canceled. Your account remains inactive.</p>
        </>
      )}
    </motion.div>
  );
}