// src/app/(dashboardLayout)/(superAdminRoutes)/super-admin/subscriptions-overview/_components/ViewPaymentDialog.tsx

"use client";

import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Building2,
  User,
  Mail,
  Calendar,
  DollarSign,
  Clock,
  Hash,
  Shield,
} from "lucide-react";
import type { ISubscriptionPayment } from "@/types/subscription";
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  PLAN_LABELS,
  PLAN_COLORS,
} from "@/types/subscription";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: ISubscriptionPayment | null;
}

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

export default function ViewPaymentDialog({
  open,
  onOpenChange,
  payment,
}: Props) {
  if (!payment) return null;

  const statusColor = PAYMENT_STATUS_COLORS[payment.status] ?? "#6b7280";
  const planColor = PLAN_COLORS[payment.plan] ?? "#6b7280";
  const isExpired = payment.expiresAt
    ? new Date(payment.expiresAt) < new Date()
    : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 p-0 overflow-hidden rounded-[1.5rem] border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Payment Details</DialogTitle>
        </VisuallyHidden>

        {/* ─── Header ─── */}
        <div className="border-b border-border/40 bg-muted/10 px-6 pt-8 pb-6 sm:px-8">
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-inner border border-primary/20 bg-card"
              style={{
                background: `linear-gradient(135deg, ${BRAND_PURPLE}15, ${BRAND_TEAL}15)`,
              }}
            >
              <CreditCard
                className="h-7 w-7"
                style={{ color: BRAND_TEAL }}
              />
            </div>
            <div className="flex-1 pt-0.5">
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                Payment Details
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  className="px-2.5 py-0.5 text-xs font-bold"
                  style={{
                    backgroundColor: `${statusColor}15`,
                    color: statusColor,
                    border: `1px solid ${statusColor}40`,
                  }}
                >
                  {PAYMENT_STATUS_LABELS[payment.status]}
                </Badge>
                <Badge
                  className="px-2.5 py-0.5 text-xs font-bold"
                  style={{
                    backgroundColor: `${planColor}15`,
                    color: planColor,
                    border: `1px solid ${planColor}40`,
                  }}
                >
                  {PLAN_LABELS[payment.plan]} Plan
                </Badge>
                {isExpired && (
                  <Badge
                    variant="destructive"
                    className="px-2.5 py-0.5 text-xs font-bold"
                  >
                    Expired
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Body ─── */}
        <div className="max-h-[65vh] overflow-y-auto custom-scrollbar px-6 py-6 sm:px-8 space-y-5">
          {/* Amount Card */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card p-5 shadow-sm">
            <DollarSign className="mb-2 h-6 w-6" style={{ color: BRAND_TEAL }} />
            <span className="text-3xl font-black text-foreground">
              ৳{payment.amount.toLocaleString()}
            </span>
            <span className="mt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {payment.currency}
            </span>
          </div>

          {/* University & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Account Information
            </h4>
            <InfoRow
              icon={Building2}
              label="University"
              value={payment.university?.name ?? "Unknown"}
            />
            <InfoRow
              icon={User}
              label="Admin"
              value={payment.admin?.user?.name ?? "Unknown"}
            />
            <InfoRow
              icon={Mail}
              label="Email"
              value={payment.admin?.user?.email ?? "Unknown"}
            />
          </div>

          {/* Dates */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Timeline
            </h4>
            <InfoRow
              icon={Calendar}
              label="Created"
              value={format(new Date(payment.createdAt), "MMM dd, yyyy · h:mm a")}
            />
            <InfoRow
              icon={Calendar}
              label="Paid At"
              value={
                payment.paidAt
                  ? format(new Date(payment.paidAt), "MMM dd, yyyy · h:mm a")
                  : "Not paid"
              }
            />
            <InfoRow
              icon={Clock}
              label="Expires"
              value={
                payment.expiresAt
                  ? format(new Date(payment.expiresAt), "MMM dd, yyyy")
                  : "—"
              }
              valueClass={isExpired ? "text-destructive font-bold" : ""}
            />
          </div>

          {/* Stripe IDs */}
          {(payment.stripePaymentId ||
            payment.stripeInvoiceId ||
            payment.stripeCustomerId) && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Stripe References
              </h4>
              {payment.stripePaymentId && (
                <InfoRow
                  icon={Hash}
                  label="Payment ID"
                  value={payment.stripePaymentId}
                  mono
                />
              )}
              {payment.stripeInvoiceId && (
                <InfoRow
                  icon={Hash}
                  label="Invoice ID"
                  value={payment.stripeInvoiceId}
                  mono
                />
              )}
              {payment.stripeCustomerId && (
                <InfoRow
                  icon={Shield}
                  label="Customer ID"
                  value={payment.stripeCustomerId}
                  mono
                />
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Micro-component ───

function InfoRow({
  icon: Icon,
  label,
  value,
  valueClass = "",
  mono = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  valueClass?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-3 shadow-sm transition-colors hover:bg-muted/10">
      <span className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Icon className="h-4 w-4 opacity-70" /> {label}
      </span>
      <span
        className={`text-xs sm:text-sm font-semibold text-foreground text-right truncate max-w-[55%] ${valueClass} ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}