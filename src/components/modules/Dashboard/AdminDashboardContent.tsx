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
import { getAdminDashboardData } from "@/services/dashboard.services";
import { ApiResponse } from "@/types/api.types";
import {  AdminDashboardData, ChartItem } from "@/types/dashboard.types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, RefreshCw } from "lucide-react";

function toChartItems(
  data: { status: string; count: number }[] | undefined
): ChartItem[] {
  if (!data) return [];
  return data.map((item) => ({
    name: formatEnumLabel(item.status),
    value: item.count,
  }));
}


const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div>
      <Skeleton className="h-7 w-52" />
      <Skeleton className="mt-1.5 h-4 w-80" />
    </div>

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

    <div className="grid gap-6 lg:grid-cols-2">
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

    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-75 w-full rounded-lg" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border/40 p-3"
            >
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <div className="space-y-1.5 text-right">
                <Skeleton className="ml-auto h-4 w-8" />
                <Skeleton className="ml-auto h-3 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);


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
        Something went wrong while fetching your data.
      </p>
    </div>
    <Button onClick={onRetry} variant="outline" size="sm">
      <RefreshCw className="mr-2 h-4 w-4" />
      Try Again
    </Button>
  </div>
);


const AdminDashboardContent = () => {
  const {
    data: adminDashboardData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin-dashboard-data"],
    queryFn: getAdminDashboardData,
    refetchOnWindowFocus: "always",
  });

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <DashboardError onRetry={() => refetch()} />;

  // ── Safely extract the data payload ──
  const stats = (adminDashboardData as ApiResponse<AdminDashboardData>)?.data;

  if (!stats) return <DashboardError onRetry={() => refetch()} />;

  // ── Build chart data ──
  const userDistribution: ChartItem[] = [
    { name: "Students", value: stats.counts?.totalStudents || 0 },
    { name: "Dept Heads", value: stats.counts?.totalDeptHeads || 0 },
    { name: "Reviewers", value: stats.counts?.totalReviewers || 0 },
  ];

  const applicationStatus = toChartItems(
    stats.charts?.applicationStatusDistribution
  );
  const scholarshipStatus = toChartItems(
    stats.charts?.scholarshipStatusDistribution
  );
  const academicStatus = toChartItems(
    stats.charts?.academicStatusDistribution
  );

  return (
    <div className="space-y-6">
      {/* ═══ HEADER ═══ */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor your university&apos;s key metrics and scholarship activity.
        </p>
      </div>

      {/* ═══ STATS CARDS ═══ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={stats.counts?.totalStudents || 0}
          iconName="Users"
          description={`${stats.counts?.activeUsersInUni || 0} active users`}
        />
        <StatsCard
          title="Active Scholarships"
          value={stats.counts?.activeScholarships || 0}
          iconName="Award"
          description={`${stats.counts?.totalScholarships || 0} total scholarships`}
        />
        <StatsCard
          title="Total Applications"
          value={stats.counts?.totalApplications || 0}
          iconName="FileText"
          description={`${stats.counts?.approvedApplications || 0} approved`}
        />
        <StatsCard
          title="Total Disbursed"
          value={formatCurrency(stats.financials?.totalDisbursedAmount || 0)}
          iconName="DollarSign"
          description={`${stats.counts?.totalDisbursements || 0} disbursements`}
        />
        <StatsCard
          title="Departments"
          value={stats.counts?.totalDepartments || 0}
          iconName="Building2"
          description={`${stats.counts?.totalDeptHeads || 0} department heads`}
        />
        <StatsCard
          title="Pending Screening"
          value={stats.counts?.pendingScreening || 0}
          iconName="Clock"
          description="Awaiting dept head review"
        />
        <StatsCard
          title="Pending Review"
          value={stats.counts?.pendingReview || 0}
          iconName="ClipboardCheck"
          description="Awaiting committee review"
        />
        <StatsCard
          title="Pending Disbursements"
          value={stats.counts?.pendingDisbursements || 0}
          iconName="Wallet"
          description={`${stats.counts?.bannedUsersInUni || 0} banned users`}
        />
      </div>

      {/* ═══ BAR CHART + PIE CHART ═══ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardBarChart
          data={userDistribution}
          title="User Distribution"
          description="Breakdown by role in your university"
        />
        <DashboardPieChart
          data={applicationStatus}
          title="Application Status"
          description="Distribution of all application statuses"
        />
      </div>

      {/* ═══ MONTHLY + SCHOLARSHIP STATUS ═══ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyBarChart
          data={stats.charts?.monthlyApplications || []}
          title="Monthly Applications"
          description="Submissions over the last 12 months"
          valueLabel="Applications"
        />
        <DashboardPieChart
          data={scholarshipStatus}
          title="Scholarship Status"
          description="Current scholarship status distribution"
        />
      </div>

      {/* ═══ ACADEMIC STATUS + TOP SCHOLARSHIPS ═══ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardPieChart
          data={academicStatus}
          title="Student Academic Status"
          description="Academic standing of enrolled students"
          colors={["#10b981", "#f59e0b", "#ef4444", "#6b7280"]}
        />

        {/* ── Top Scholarships ── */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Top Scholarships</h3>
            <p className="text-sm text-muted-foreground">
              By application count
            </p>
          </CardHeader>
          <CardContent>
            {!stats.topScholarships?.length ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No scholarships yet.
              </p>
            ) : (
              <div className="space-y-3">
                {stats.topScholarships.map((scholarship, index) => (
                  <div
                    key={scholarship.id}
                    className="flex items-center justify-between rounded-lg border border-border/40 p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                        style={{
                          backgroundColor:
                            index === 0
                              ? "#0097b2"
                              : index === 1
                                ? "#4b2875"
                                : "#64748b",
                        }}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {scholarship.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatEnumLabel(scholarship.status)} ·{" "}
                          {formatCurrency(scholarship.amountPerStudent)}
                          /student
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-foreground">
                        {scholarship.applicationCount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        of {scholarship.quota} quota
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardContent;