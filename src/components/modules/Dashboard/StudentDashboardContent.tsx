"use client";

import { DashboardPieChart } from "@/components/shared/charts";
import StatsCard from "@/components/shared/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatEnumLabel } from "@/lib/formatters";
import { getDashboardData } from "@/services/dashboard.services";
import { ApiResponse } from "@/types/api.types";
import { ChartItem, StudentDashboardData } from "@/types/dashboard.types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowUpRight, GraduationCap, RefreshCw } from "lucide-react";
import Link from "next/link";
import { format, parseISO } from "date-fns";

// ─── Transform helper ───
function toChartItems(data: { status: string; count: number }[] | undefined): ChartItem[] {
  if (!data) return [];
  return data.map((item) => ({
    name: formatEnumLabel(item.status),
    value: item.count,
  }));
}

// ═══════════════════════════════════════════
// LOADING SKELETON
// ═══════════════════════════════════════════
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div>
      <Skeleton className="h-7 w-56" />
      <Skeleton className="mt-1.5 h-4 w-96" />
    </div>

    {/* Academic overview skeleton */}
    <Card className="border-border/40 bg-card/60">
      <CardContent className="py-6">
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
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

    {/* Charts & Table skeleton */}
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
          <CardContent><Skeleton className="h-75 w-full" /></CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </CardContent>
        </Card>
      </div>
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
      <p className="text-sm font-medium text-foreground">Failed to load student dashboard</p>
      <p className="mt-1 text-sm text-muted-foreground">Something went wrong while fetching your data.</p>
    </div>
    <Button onClick={onRetry} variant="outline" size="sm">
      <RefreshCw className="mr-2 h-4 w-4" /> Try Again
    </Button>
  </div>
);

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════
const StudentDashboardContent = () => {
  const { data: dashboardResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ["student-dashboard-data"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: "always",
  });

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <DashboardError onRetry={() => refetch()} />;

  const stats = (dashboardResponse as ApiResponse<StudentDashboardData>)?.data;
  if (!stats) return <DashboardError onRetry={() => refetch()} />;

  const applicationStatus = toChartItems(stats.charts?.applicationStatusDistribution);

  return (
    <div className="space-y-6">
      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Student Workspace
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {stats.university?.name || "Welcome back!"} · Monitor your scholarship applications.
          </p>
        </div>
        <Button asChild className="bg-[#0097b2] hover:bg-[#0097b2]/90">
          <Link href="/scholarships">
            Browse Scholarships <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* ═══ ACADEMIC QUICK VIEW ═══ */}
      {stats.academicInfo && (
        <Card className="overflow-hidden border-border/40 bg-card/60 shadow-sm backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-0.5 w-full bg-linear-to-r from-[#4b2875] to-[#0097b2]" />
          <CardContent className="pt-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0097b2]/10 text-[#0097b2]">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {stats.academicInfo.department.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Level: {stats.academicInfo.level.name} · {stats.academicInfo.term.name}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-12 gap-y-2 md:grid-cols-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">GPA</p>
                  <p className="text-xl font-bold text-foreground">{stats.academicInfo.gpa.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">CGPA</p>
                  <p className="text-xl font-bold text-foreground">{stats.academicInfo.cgpa.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Credits Completed</p>
                  <p className="text-xl font-bold text-foreground">{stats.academicInfo.creditHoursCompleted}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <p className="text-sm font-semibold text-[#10b981]">{formatEnumLabel(stats.academicInfo.academicStatus)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ═══ STATS CARDS ═══ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Received Funds"
          value={formatCurrency(stats.financials?.totalReceivedAmount || 0)}
          iconName="DollarSign"
          description="Total successfully disbursed payouts"
        />
        <StatsCard
          title="Applied Scholarships"
          value={stats.counts?.totalApplications || 0}
          iconName="FileText"
          description={`${stats.counts?.inProgressApplications || 0} currently processing`}
        />
        <StatsCard
          title="Approved Scholarships"
          value={stats.counts?.approvedApplications || 0}
          iconName="CheckCircle2"
          description={`${stats.counts?.disbursedApplications || 0} total payouts`}
        />
        <StatsCard
          title="Open Competitions"
          value={stats.counts?.availableScholarships || 0}
          iconName="Search"
          description="Live scholarships accepting applications"
        />
      </div>

      {/* ═══ CHARTS + RECENT APPLICATIONS ═══ */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pie Chart (1/3 Width) */}
        <div className="lg:col-span-1">
          <DashboardPieChart
            data={applicationStatus}
            title="Applications Flow"
            description="Your application submissions states"
            height={300}
          />
        </div>

        {/* Recent Applications List (2/3 Width) */}
        <div className="lg:col-span-2">
          <Card className="h-full border-border/40 bg-card/60 shadow-sm backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Recent Submissions</h3>
                <p className="text-xs text-muted-foreground">Track your most recent scholarship attempts</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/student/my-applications">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {!stats.recentApplications?.length ? (
                <div className="flex h-70 flex-col items-center justify-center text-center">
                  <p className="text-sm font-medium text-foreground">No applications yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">Start by applying to open scholarships.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between rounded-lg border border-border/40 p-3 transition-all hover:bg-muted/50"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <Link
                          href={`/student/my-applications/${app.id}`}
                          className="truncate text-sm font-semibold text-foreground hover:underline"
                        >
                          {app.scholarship.title}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Submitted: {app.submittedAt ? format(parseISO(app.submittedAt), "MMM dd, yyyy") : format(parseISO(app.createdAt), "MMM dd, yyyy")}</span>
                          <span>·</span>
                          <span>Value: {formatCurrency(app.scholarship.amountPerStudent)}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center gap-3">
                        <span
                          className={`rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide uppercase ${
                            app.status === "APPROVED" || app.status === "DISBURSED"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : app.status === "REJECTED"
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {formatEnumLabel(app.status)}
                        </span>
                        <Button asChild size="icon" variant="ghost" className="h-8 w-8">
                          <Link href={`/student/my-applications/${app.id}`}>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardContent;