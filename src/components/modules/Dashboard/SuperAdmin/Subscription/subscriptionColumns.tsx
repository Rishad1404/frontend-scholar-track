// src/app/(dashboardLayout)/(superAdminRoutes)/super-admin/subscriptions-overview/_components/subscriptionColumns.tsx

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Building2, CreditCard } from "lucide-react";
import DateCell from "@/components/shared/cell/DateCell";
import type { ISubscriptionPayment } from "@/types/subscription";
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
  PLAN_LABELS,
  PLAN_COLORS,
} from "@/types/subscription";

export const subscriptionColumns: ColumnDef<ISubscriptionPayment>[] = [
  {
    accessorKey: "university.name",
    header: "University",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-3 min-w-0 max-w-60">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50">
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {row.original.university?.name ?? "Unknown"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {row.original.admin?.user?.email ?? ""}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "plan",
    header: "Plan",
    enableSorting: true,
    cell: ({ row }) => {
      const plan = row.original.plan;
      const color = PLAN_COLORS[plan] ?? "#6b7280";
      return (
        <Badge
          className="text-xs font-bold gap-1"
          style={{
            backgroundColor: `${color}15`,
            color,
            border: `1px solid ${color}40`,
          }}
        >
          <CreditCard className="h-3 w-3" />
          {PLAN_LABELS[plan] ?? plan}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    enableSorting: true,
    cell: ({ row }) => (
      <div>
        <span className="text-sm font-bold">
          ৳{row.original.amount.toLocaleString()}
        </span>
        <span className="ml-1 text-xs text-muted-foreground">
          {row.original.currency}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const s = row.original.status;
      const color = PAYMENT_STATUS_COLORS[s] ?? "#6b7280";
      return (
        <Badge
          className="text-xs font-semibold"
          style={{
            backgroundColor: `${color}15`,
            color,
            border: `1px solid ${color}40`,
          }}
        >
          {PAYMENT_STATUS_LABELS[s] ?? s}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paidAt",
    header: "Paid At",
    enableSorting: true,
    cell: ({ row }) =>
      row.original.paidAt ? (
        <span className="text-sm text-muted-foreground">
          {format(new Date(row.original.paidAt), "MMM dd, yyyy")}
        </span>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "expiresAt",
    header: "Expires",
    enableSorting: true,
    cell: ({ row }) => {
      if (!row.original.expiresAt) {
        return <span className="text-sm text-muted-foreground">—</span>;
      }
      const expiresAt = new Date(row.original.expiresAt);
      const isExpired = expiresAt < new Date();
      return (
        <span
          className={`text-sm ${isExpired ? "text-destructive font-semibold" : "text-muted-foreground"}`}
        >
          {format(expiresAt, "MMM dd, yyyy")}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    enableSorting: true,
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
];