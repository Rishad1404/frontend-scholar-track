// src/app/(dashboardLayout)/(superAdminRoutes)/super-admin/subscriptions-overview/_components/SubscriptionsTable.tsx

"use client";

import { use, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
} from "lucide-react";

import { getAllSubscriptionPayments } from "@/services/subscriptionPayment.services";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import type { ISubscriptionPayment } from "@/types/subscription";
import type { PaginationMeta } from "@/types/api.types";
import DataTable from "@/components/shared/table/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { subscriptionColumns } from "./subscriptionColumns";
import ViewPaymentDialog from "./ViewPaymentDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

interface SubscriptionResponse {
  success: boolean;
  data: ISubscriptionPayment[] | { data: ISubscriptionPayment[]; meta?: PaginationMeta };
  meta?: PaginationMeta;
}

export default function SubscriptionsTable({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<Record<string, string | string[]>>;
}) {
  const resolvedSearchParams = use(searchParamsPromise);
  const initialQueryString = new URLSearchParams(
    resolvedSearchParams as Record<string, string>,
  ).toString();

  const searchParams = useSearchParams();

  // View dialog state (view-only, no edit/delete)
  const [viewingPayment, setViewingPayment] = useState<ISubscriptionPayment | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Filter state
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  const {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  });

  // Build query string with filters
  const baseQuery = queryStringFromUrl || initialQueryString;
  const queryString = useMemo(() => {
    const params = new URLSearchParams(baseQuery);
    if (statusFilter !== "all") params.set("status", statusFilter);
    else params.delete("status");
    if (planFilter !== "all") params.set("plan", planFilter);
    else params.delete("plan");
    return params.toString();
  }, [baseQuery, statusFilter, planFilter]);

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  const {
    data: paymentsResponse,
    isLoading,
    isFetching,
  } = useQuery<SubscriptionResponse>({
    queryKey: ["subscription-payments", queryString],
    queryFn: () => getAllSubscriptionPayments(queryString),
  });

  const payments: ISubscriptionPayment[] = useMemo(() => {
    const raw = paymentsResponse?.data;
    if (Array.isArray(raw)) {
      return raw;
    }
    if (raw && "data" in raw && Array.isArray(raw.data)) {
      return raw.data;
    }
    return [];
  }, [paymentsResponse]);

  const meta: PaginationMeta | undefined = paymentsResponse?.meta;
  // ── Compute summary stats from current page ──
  const stats = useMemo(() => {
    // If payments isn't an array yet, return zeroed stats
    if (!Array.isArray(payments)) {
      return {
        totalRevenue: 0,
        completedCount: 0,
        pendingCount: 0,
        failedCount: 0,
        totalRecords: 0,
      };
    }

    const completed = payments.filter((p) => p.status === "COMPLETED");
    const pending = payments.filter((p) => p.status === "PENDING");
    const failed = payments.filter((p) => p.status === "FAILED");
    const totalRevenue = completed.reduce((acc, p) => acc + p.amount, 0);

    return {
      totalRevenue,
      completedCount: completed.length,
      pendingCount: pending.length,
      failedCount: failed.length,
      totalRecords: meta?.total ?? 0,
    };
  }, [payments, meta]);

  // ── Table actions (view only) ──
  const tableActions = {
    onView: (payment: ISubscriptionPayment) => {
      setViewingPayment(payment);
      setIsViewOpen(true);
    },
  };

  return (
    <>
      {/* Header */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <CreditCard className="h-7 w-7 text-primary" style={{ color: BRAND_TEAL }} />
            Subscriptions Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor all subscription payments across the platform.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`৳${stats.totalRevenue.toLocaleString()}`}
          color={BRAND_TEAL}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={stats.completedCount.toString()}
          color="#16a34a"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={stats.pendingCount.toString()}
          color="#f59e0b"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Records"
          value={stats.totalRecords.toString()}
          color={BRAND_PURPLE}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
        <DataTable
          data={payments}
          columns={subscriptionColumns}
          isLoading={isLoading || isFetching || isRouteRefreshPending}
          emptyMessage="No subscription payments found."
          sorting={{
            state: optimisticSortingState,
            onSortingChange: handleSortingChange,
          }}
          pagination={{
            state: optimisticPaginationState,
            onPaginationChange: handlePaginationChange,
          }}
          search={{
            initialValue: searchTermFromUrl,
            placeholder: "Search by university name...",
            debounceMs: 700,
            onDebouncedChange: handleDebouncedSearchChange,
          }}
          toolbarAction={
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-36 rounded-xl text-xs font-semibold">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="h-9 w-32 rounded-xl text-xs font-semibold">
                  <SelectValue placeholder="All Plans" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
          meta={meta}
          actions={tableActions}
        />
      </div>

      {/* View Dialog */}
      <ViewPaymentDialog
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        payment={viewingPayment}
      />
    </>
  );
}

// ─── Summary Stat Card ───

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-5 pb-5 flex items-center gap-4">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <div>
          <p className="text-lg font-extrabold">{value}</p>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
