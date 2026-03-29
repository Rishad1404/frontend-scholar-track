"use client";

import {
  DashboardBarChart,
  DashboardPieChart,
  MonthlyBarChart,
} from "@/components/shared/charts";
import StatsCard from "@/components/shared/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatEnumLabel } from "@/lib/formatters";
import { getSuperAdminDashboardData } from "@/services/dashboard.services";
import { ApiResponse } from "@/types/api.types";
import { ChartItem, SuperAdminDashboardData } from "@/types/dashboard.types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, RefreshCw } from "lucide-react";

// ─── Transform { status, count }[] → { name, value }[] ───
function toChartItems(
  data: { status: string; count: number }[] | undefined
): ChartItem[] {
  if (!data) return [];
  return data.map((item) => ({
    name: formatEnumLabel(item.status),
    value: item.count,
  }));
}

// ─── Transform { role, count }[] → { name, value }[] ───
function toRoleChartItems(
  data: { role: string; count: number }[] | undefined
): ChartItem[] {
  if (!data) return [];
  return data.map((item) => ({
    name: formatEnumLabel(item.role),
    value: item.count,
  }));
}

// ═══════════════════════════════════════════
// LOADING SKELETON
// ═══════════════════════════════════════════
const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Header */}
    <div>
      <Skeleton className="h-7 w-56" />
      <Skeleton className="mt-1.5 h-4 w-96" />
    </div>

    {/* Stats cards */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </CardHeader>
          <CardContent className="pb-5">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="mt-2 h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Chart rows */}
    {Array.from({ length: 3 }).map((_, rowIdx) => (
      <div key={rowIdx} className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-56" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-87.5 w-full rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════
// ERROR STATE
// ═══════════════════════════════════════════
const DashboardError = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
      <AlertCircle className="h-7 w-7 text-destructive" />
    </div>
    <div className="text-center">
      <p className="text-sm font-medium text-foreground">
        Failed to load dashboard
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Something went wrong while fetching platform data.
      </p>
    </div>
    <Button onClick={onRetry} variant="outline" size="sm">
      <RefreshCw className="mr-2 h-4 w-4" />
      Try Again
    </Button>
  </div>
);

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════
const SuperAdminDashboardContent = () => {
  const {
    data: dashboardResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["super-admin-dashboard-data"],
    queryFn: getSuperAdminDashboardData,
    refetchOnWindowFocus: "always",
  });

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <DashboardError onRetry={() => refetch()} />;

  // ── Safely extract the data payload ──
  const stats = (
    dashboardResponse as ApiResponse<SuperAdminDashboardData>
  )?.data;

  if (!stats) return <DashboardError onRetry={() => refetch()} />;

  // ── Build chart data ──
  const roleDistribution = toRoleChartItems(stats.charts?.roleDistribution);
  const universityStatus = toChartItems(
    stats.charts?.universityStatusDistribution
  );
  const userStatus = toChartItems(stats.charts?.userStatusDistribution);
  const applicationStatus = toChartItems(stats.charts?.applicationStatusPie);

  return (
    <div className="space-y-6">
      {/* ═══ HEADER ═══ */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Platform Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor all universities, users, scholarships, and platform revenue.
        </p>
      </div>

      {/* ═══ STATS CARDS — ROW 1 ═══ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats.counts?.totalUsers || 0}
          iconName="Users"
          description={`${stats.counts?.activeUsers || 0} active · ${stats.counts?.bannedUsers || 0} banned`}
        />
        <StatsCard
          title="Universities"
          value={stats.counts?.totalUniversities || 0}
          iconName="Building2"
          description={`${stats.counts?.activeUniversities || 0} active · ${stats.counts?.pendingUniversities || 0} pending`}
        />
        <StatsCard
          title="Total Students"
          value={stats.counts?.totalStudents || 0}
          iconName="GraduationCap"
          description="Registered across all universities"
        />
        <StatsCard
          title="Total Scholarships"
          value={stats.counts?.totalScholarships || 0}
          iconName="Award"
          description={`${stats.counts?.activeScholarships || 0} currently active`}
        />
        <StatsCard
          title="Total Applications"
          value={stats.counts?.totalApplications || 0}
          iconName="FileText"
          description="Across all universities"
        />
        <StatsCard
          title="Total Disbursements"
          value={stats.counts?.totalDisbursements || 0}
          iconName="CreditCard"
          description="Scholarship payouts processed"
        />
        <StatsCard
          title="Disbursed Amount"
          value={formatCurrency(
            stats.financials?.totalDisbursedAmount || 0
          )}
          iconName="DollarSign"
          description="Total funds distributed"
        />
        <StatsCard
          title="Subscription Revenue"
          value={formatCurrency(
            stats.financials?.totalSubscriptionRevenue || 0
          )}
          iconName="TrendingUp"
          description="Total platform revenue"
        />
      </div>

      {/* ═══ ROLE DISTRIBUTION BAR + UNIVERSITY STATUS PIE ═══ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardBarChart
          data={roleDistribution}
          title="User Role Distribution"
          description="Breakdown of users by role across the platform"
        />
        <DashboardPieChart
          data={universityStatus}
          title="University Status"
          description="Current status of registered universities"
          colors={["#f59e0b", "#10b981", "#ef4444"]}
        />
      </div>

      {/* ═══ MONTHLY APPLICATIONS + APPLICATION STATUS PIE ═══ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyBarChart
          data={stats.charts?.monthlyApplications || []}
          title="Monthly Applications"
          description="Application submissions across all universities"
          valueKey="count"
          valueLabel="Applications"
        />
        <DashboardPieChart
          data={applicationStatus}
          title="Application Status"
          description="Distribution of all application statuses"
        />
      </div>

      {/* ═══ MONTHLY REVENUE + USER STATUS PIE ═══ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyBarChart
          data={stats.charts?.monthlyRevenue || []}
          title="Monthly Revenue"
          description="Subscription revenue over the last 12 months"
          valueKey="total"
          valueLabel="Revenue"
          color="#4b2875"
          isCurrency
          currencySymbol="৳"
        />
        <DashboardPieChart
          data={userStatus}
          title="User Status"
          description="Active, banned, and deleted users"
          colors={["#10b981", "#ef4444", "#6b7280"]}
        />
      </div>
    </div>
  );
};

export default SuperAdminDashboardContent;