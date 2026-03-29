"use client";

import { DashboardBarChart, DashboardPieChart } from "@/components/shared/charts";
import StatsCard from "@/components/shared/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatEnumLabel } from "@/lib/formatters";
import { getDashboardData } from "@/services/dashboard.services";
import { ApiResponse } from "@/types/api.types";
import { ChartItem, DepartmentHeadDashboardData } from "@/types/dashboard.types";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  RefreshCw,
  XCircle,
} from "lucide-react";

// ─── Transform helper ───
function toChartItems(
  data: { status: string; count: number }[] | undefined
): ChartItem[] {
  if (!data) return [];
  return data.map((item) => ({
    name: formatEnumLabel(item.status),
    value: item.count,
  }));
}

// ═══════════════════════════════════════════
// SCREENING RATE RING
// ═══════════════════════════════════════════
const ScreeningRateRing = ({ rate }: { rate: number }) => {
  const circumference = 2 * Math.PI * 40;
  const filled = (rate / 100) * circumference;
  const empty = circumference - filled;

  const rateColor =
    rate >= 70
      ? "#10b981"
      : rate >= 40
        ? "#f59e0b"
        : "#ef4444";

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="relative h-28 w-28">
        <svg
          className="h-full w-full -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Background ring */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            className="stroke-muted/40"
            strokeWidth="8"
          />
          {/* Filled ring */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={rateColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${empty}`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-extrabold"
            style={{ color: rateColor }}
          >
            {rate}%
          </span>
        </div>
      </div>
      <p className="text-xs font-medium text-muted-foreground">
        Screening Pass Rate
      </p>
    </div>
  );
};

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

    {/* Department banner */}
    <Card>
      <CardContent className="py-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Stats cards */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
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

    {/* Screening + Charts */}
    <div className="grid gap-6 lg:grid-cols-3">
      <Card>
        <CardContent className="py-6">
          <Skeleton className="mx-auto h-28 w-28 rounded-full" />
          <Skeleton className="mx-auto mt-4 h-3 w-24" />
        </CardContent>
      </Card>
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-56" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-75 w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Charts row */}
    <div className="grid gap-6 lg:grid-cols-2">
      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-56" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-75 w-full rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
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
        Something went wrong while fetching your department data.
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
const DepartmentHeadDashboardContent = () => {
  const {
    data: dashboardResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["department-head-dashboard-data"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: "always",
  });

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <DashboardError onRetry={() => refetch()} />;

  const stats = (
    dashboardResponse as ApiResponse<DepartmentHeadDashboardData>
  )?.data;

  if (!stats) return <DashboardError onRetry={() => refetch()} />;

  // ── Build chart data ──
  const applicationStatus = toChartItems(
    stats.charts?.applicationStatusDistribution
  );
  const academicStatus = toChartItems(
    stats.charts?.academicStatusDistribution
  );

  const screeningBreakdown: ChartItem[] = [
    { name: "Passed", value: stats.counts?.screeningPassed || 0 },
    { name: "Rejected", value: stats.counts?.screeningRejected || 0 },
    { name: "Pending", value: stats.counts?.pendingScreening || 0 },
  ];

  return (
    <div className="space-y-6">
      {/* ═══ HEADER ═══ */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Department Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage screenings and monitor your department&apos;s scholarship
          activity.
        </p>
      </div>

      {/* ═══ DEPARTMENT CONTEXT BANNER ═══ */}
      <Card className="overflow-hidden border-border/40 bg-card/60 shadow-sm backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-0.5 w-full bg-linear-to-r from-[#4b2875] to-[#0097b2]" />
        <CardContent className="pt-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#4b2875]/10 text-[#4b2875] dark:bg-[#4b2875]/20">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {stats.department?.name || "Department"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {stats.university?.name || "University"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-x-8 gap-y-2">
              <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground">
                  Students
                </p>
                <p className="text-xl font-bold text-foreground">
                  {stats.counts?.totalStudentsInDept || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground">
                  Scholarships
                </p>
                <p className="text-xl font-bold text-foreground">
                  {stats.counts?.totalScholarshipsForDept || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-muted-foreground">
                  Active
                </p>
                <p className="text-xl font-bold text-[#0097b2]">
                  {stats.counts?.activeScholarshipsForDept || 0}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ═══ STATS CARDS ═══ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pending Screening"
          value={stats.counts?.pendingScreening || 0}
          iconName="Clock"
          description="Applications awaiting your review"
        />
        <StatsCard
          title="Total Screened"
          value={stats.counts?.totalScreened || 0}
          iconName="ClipboardCheck"
          description={`${stats.counts?.screeningPassed || 0} passed · ${stats.counts?.screeningRejected || 0} rejected`}
        />
        <StatsCard
          title="Dept Students"
          value={stats.counts?.totalStudentsInDept || 0}
          iconName="Users"
          description="Enrolled in your department"
        />
        <StatsCard
          title="Active Scholarships"
          value={stats.counts?.activeScholarshipsForDept || 0}
          iconName="Award"
          description={`${stats.counts?.totalScholarshipsForDept || 0} total in department`}
        />
      </div>

      {/* ═══ SCREENING PERFORMANCE + BREAKDOWN ═══ */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Screening Rate Ring (1/3) */}
        <Card className="flex flex-col border-border/40 bg-card/60 shadow-sm backdrop-blur-xl">
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">
              Screening Performance
            </h3>
            <p className="text-xs text-muted-foreground">
              Overall pass rate from your reviews
            </p>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col items-center justify-center gap-6 pb-6">
            <ScreeningRateRing rate={stats.screeningRate || 0} />

            {/* Pass / Reject counts */}
            <div className="flex w-full items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {stats.counts?.screeningPassed || 0}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Passed</p>
                </div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10">
                  <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {stats.counts?.screeningRejected || 0}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Rejected</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Screening Breakdown Bar Chart (2/3) */}
        <div className="lg:col-span-2">
          <DashboardBarChart
            data={screeningBreakdown}
            title="Screening Breakdown"
            description="Passed, rejected, and pending applications"
            className="h-full"
            color="#10b981"
          />
        </div>
      </div>

      {/* ═══ APPLICATION STATUS PIE + ACADEMIC STATUS PIE ═══ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardPieChart
          data={applicationStatus}
          title="Application Status"
          description="All applications for department scholarships"
        />
        <DashboardPieChart
          data={academicStatus}
          title="Student Academic Status"
          description="Academic standing of students in your department"
          colors={["#10b981", "#f59e0b", "#ef4444", "#6b7280"]}
        />
      </div>
    </div>
  );
};

export default DepartmentHeadDashboardContent;