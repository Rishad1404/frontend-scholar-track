/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(dashboardLayout)/(adminRoutes)/admin/subscription/components/PaymentHistory.tsx
"use client";

import { motion } from "framer-motion";
import { Receipt, CheckCircle, XCircle, Clock, RotateCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const statusConfig: Record<string, { icon: any; color: string; bgColor: string }> = {
  COMPLETED: { icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-500/15 border-emerald-500/20" },
  PENDING: { icon: Clock, color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-500/15 border-amber-500/20" },
  FAILED: { icon: XCircle, color: "text-rose-600 dark:text-rose-400", bgColor: "bg-rose-500/15 border-rose-500/20" },
  REFUNDED: { icon: RotateCw, color: "text-gray-600 dark:text-gray-400", bgColor: "bg-gray-500/15 border-gray-500/20" },
};

export function PaymentHistory({ payments }: { payments: any[] }) {
  if (!payments || payments.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <div className="mb-4 flex items-center justify-between px-1">
        <h2 className="text-lg font-bold text-foreground">
          Payment History
        </h2>
        <span className="text-xs font-medium text-muted-foreground">{payments.length} transactions</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm">
        {/* Desktop Table */}
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 hover:bg-transparent bg-muted/20">
                <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider">Date</TableHead>
                <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider">Plan</TableHead>
                <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider">Amount</TableHead>
                <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider">Valid Until</TableHead>
                <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment, index) => {
                const config = statusConfig[payment.status] || statusConfig.PENDING;
                const StatusIcon = config.icon;
                const validId = payment.id && payment.id !== "#" ? payment.id : null;
                const stableKey = validId ?? payment._id ?? payment.invoice ?? `payment-table-${index}`;

                return (
                  <motion.tr
                    key={stableKey}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-border/40 transition-colors hover:bg-muted/30"
                  >
                    <TableCell className="py-3.5 text-sm font-medium text-foreground">
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : new Date(payment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </TableCell>

                    <TableCell className="py-3.5">
                      <span className="inline-flex items-center rounded-md border border-border/40 bg-muted/40 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                        {payment.plan}
                      </span>
                    </TableCell>

                    <TableCell className="py-3.5 text-sm font-bold">
                      ৳{Number(payment.amount).toLocaleString()}
                    </TableCell>

                    <TableCell className="py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${config.bgColor} ${config.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {payment.status}
                      </span>
                    </TableCell>

                    <TableCell className="py-3.5 text-sm text-muted-foreground">
                      {payment.expiresAt || payment.validUntil || payment.currentPeriodEnd
                        ? new Date(payment.expiresAt || payment.validUntil || payment.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </TableCell>

                    <TableCell className="py-3.5 text-right">
                      {payment.status === "COMPLETED" && (
                        <button
                          className="inline-flex items-center justify-end gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors hover:bg-muted/80"
                          style={{ color: BRAND.teal }}
                        >
                          <Receipt className="h-3.5 w-3.5" />
                          Download
                        </button>
                      )}
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-3 p-4 sm:hidden bg-muted/10">
          {payments.map((payment, index) => {
            const config = statusConfig[payment.status] || statusConfig.PENDING;
            const StatusIcon = config.icon;
            const validId = payment.id && payment.id !== "#" ? payment.id : null;
            const stableKey = validId ?? payment._id ?? payment.invoice ?? `payment-mobile-${index}`;

            return (
              <motion.div
                key={stableKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-border/40 bg-background p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between border-b border-border/40 pb-3">
                  <span className="inline-flex items-center rounded-md border border-border/40 bg-muted/50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                    {payment.plan}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${config.bgColor} ${config.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    {payment.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Amount</span>
                    <span className="text-sm font-bold">৳{Number(payment.amount).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Paid On</span>
                    <span className="text-xs font-semibold">
                      {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : "Pending"}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}