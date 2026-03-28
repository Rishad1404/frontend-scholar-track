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

const statusConfig: Record<
  string,
  { icon: any; color: string; bgColor: string }
> = {
  COMPLETED: {
    icon: CheckCircle,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  PENDING: {
    icon: Clock,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  FAILED: {
    icon: XCircle,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  REFUNDED: {
    icon: RotateCw,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
};

export function PaymentHistory({ payments }: { payments: any[] }) {
  if (!payments || payments.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12"
    >
      <h2 className="mb-6 text-xl font-bold text-foreground">
        Payment History
      </h2>

      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
        {/* Desktop Table */}
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40">
                <TableHead>Date</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead className="text-right">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment, index) => {
                const config = statusConfig[payment.status] ||
                  statusConfig.PENDING;
                const StatusIcon = config.icon;
                // Ensure a stable, unique key even when the backend returns
                // placeholder ids like `"#"` or missing id fields.
                const validId = payment.id && payment.id !== "#" ? payment.id : null;
                const stableKey = validId ?? payment._id ?? payment.invoice ?? `payment-table-${index}`;

                return (
                  <motion.tr
                    key={stableKey}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-border/40"
                  >
                    <TableCell className="font-medium">
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : new Date(payment.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-2.5 py-0.5 text-xs font-semibold">
                        {payment.plan}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold">
                        ৳{Number(payment.amount).toLocaleString()}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.bgColor} ${config.color}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {payment.status}
                      </span>
                    </TableCell>

                    <TableCell>
                      {payment.expiresAt || payment.validUntil || payment.currentPeriodEnd
                        ? new Date(payment.expiresAt || payment.validUntil || payment.currentPeriodEnd).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </TableCell>

                    <TableCell className="text-right">
                      {payment.status === "COMPLETED" && (
                        <button
                          className="inline-flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
                          style={{ color: BRAND.teal }}
                        >
                          <Receipt className="h-4 w-4" />
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
        <div className="space-y-3 p-4 sm:hidden">
          {payments.map((payment, index) => {
            const config = statusConfig[payment.status] ||
              statusConfig.PENDING;
            const StatusIcon = config.icon;
            const validId = payment.id && payment.id !== "#" ? payment.id : null;
            const stableKey = validId ?? payment._id ?? payment.invoice ?? `payment-mobile-${index}`;

            return (
              <motion.div
                key={stableKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-border/40 bg-background p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full border border-border/40 bg-muted/50 px-2.5 py-0.5 text-xs font-semibold">
                    {payment.plan}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.bgColor} ${config.color}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {payment.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Amount
                    </span>
                    <span className="font-semibold">
                      ৳{Number(payment.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Paid On
                    </span>
                    <span className="text-sm font-medium">
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString()
                        : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Valid Until
                    </span>
                    <span className="text-sm font-medium">
                      {payment.expiresAt || payment.validUntil || payment.currentPeriodEnd
                        ? new Date(payment.expiresAt || payment.validUntil || payment.currentPeriodEnd).toLocaleDateString()
                        : "—"}
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