"use client";

import { DashboardBarChart, DashboardPieChart } from "@/components/shared/charts";
import StatsCard from "@/components/shared/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboardData } from "@/services/dashboard.services";
import { ApiResponse } from "@/types/api.types";
import { ChartItem, ReviewerDashboardData } from "@/types/dashboard.types";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  GaugeCircle,
  Minus,
  RefreshCw,
} from "lucide-react";

// ═══════════════════════════════════════════
// SCORE GAUGE — SVG semicircle meter
// ═══════════════════════════════════════════
const ScoreGauge = ({
  score,
  maxScore,
  label,
}: {
  score: number;
  maxScore: number;
  label: string;
}) => {
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

  // Semicircle arc (180 degrees)
  const radius = 45;
  const circumference = Math.PI * radius; // half circle
  const filled = (percentage / 100) * circumference;

  const gaugeColor =
    percentage >= 75
      ? "#10b981"
      : percentage >= 50
        ? "#0097b2"
        : percentage >= 25
          ? "#f59e0b"
          : "#ef4444";

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-24 w-48">
        <svg
          className="h-full w-full"
          viewBox="0 0 120 70"
        >
          {/* Background arc */}
          <path
            d="M 10 65 A 45 45 0 0 1 110 65"
            fill="none"
            className="stroke-muted/30"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Filled arc */}
          <path
            d="M 10 65 A 45 45 0 0 1 110 65"
            fill="none"
            stroke={gaugeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circumference}`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center score text */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span
            className="text-3xl font-extrabold"
            style={{ color: gaugeColor }}
          >
            {score}
          </span>
          <span className="text-[11px] text-muted-foreground">
            out of {maxScore}
          </span>
        </div>
      </div>
      <p className="mt-1 text-xs font-medium text-muted-foreground">
        {label}
      </p>
    </div>
  );
};

// ═══════════════════════════════════════════
// SCORE STAT PILL — for highest/lowest/average
// ═══════════════════════════════════════════
const ScoreStatPill = ({
  label,
  value,
  maxScore,
  variant,
}: {
  label: string;
  value: number;
  maxScore: number;
  variant: "high" | "low" | "avg";
}) => {
  const config = {
    high: {
      icon: ArrowUp,
      bg: "bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-500/10",
    },
    low: {
      icon: ArrowDown,
      bg: "bg-rose-500/10",
      text: "text-rose-600 dark:text-rose-400",
      iconBg: "bg-rose-500/10",
    },
    avg: {
      icon: Minus,
      bg: "bg-[#0097b2]/10",
      text: "text-[#0097b2]",
      iconBg: "bg-[#0097b2]/10",
    },
  };

  const { icon: Icon, bg, text, iconBg } = config[variant];

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-border/40 p-3 ${bg}`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
      >
        <Icon className={`h-4 w-4 ${text}`} />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className={`text-lg font-bold ${text}`}>
          {value}{" "}
          <span className="text-xs font-normal text-muted-foreground">
            / {maxScore}
          </span>
        </p>
      </div>
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

    {/* Stats cards */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
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

    {/* Gauge + Score stats */}
    <div className="grid gap-6 lg:grid-cols-3">
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Skeleton className="h-24 w-48 rounded-full" />
        </CardContent>
      </Card>
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Charts */}
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
        Something went wrong while fetching your review data.
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
const ReviewerDashboardContent = () => {
  const {
    data: dashboardResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["reviewer-dashboard-data"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: "always",
  });

  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <DashboardError onRetry={() => refetch()} />;

  const stats = (
    dashboardResponse as ApiResponse<ReviewerDashboardData>
  )?.data;

  if (!stats) return <DashboardError onRetry={() => refetch()} />;

  // ── Build chart data ──
  const scoreDistribution: ChartItem[] = [
    { name: "Excellent (35-40)", value: stats.charts?.scoreDistribution?.excellent || 0 },
    { name: "Good (25-34)", value: stats.charts?.scoreDistribution?.good || 0 },
    { name: "Average (15-24)", value: stats.charts?.scoreDistribution?.average || 0 },
    { name: "Poor (0-14)", value: stats.charts?.scoreDistribution?.poor || 0 },
  ];

  const scoreBreakdown: ChartItem[] = [
    { name: "GPA", value: stats.scoreBreakdown?.avgGpaScore || 0 },
    { name: "Essay", value: stats.scoreBreakdown?.avgEssayScore || 0 },
    { name: "Financial", value: stats.scoreBreakdown?.avgFinancialScore || 0 },
    { name: "Criteria", value: stats.scoreBreakdown?.avgCriteriaScore || 0 },
  ];

  // Workload ratio
  const totalWork =
    (stats.counts?.reviewedApplications || 0) +
    (stats.counts?.pendingReviewApplications || 0);
  const completionRate =
    totalWork > 0
      ? Math.round(
          ((stats.counts?.reviewedApplications || 0) / totalWork) * 100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* ═══ HEADER ═══ */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Reviewer Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {stats.university?.name || "University"} · Track your review
          performance and pending assignments.
        </p>
      </div>

      {/* ═══ STATS CARDS ═══ */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Pending Reviews"
          value={stats.counts?.pendingReviewApplications || 0}
          iconName="Clock"
          description="Applications awaiting your review"
        />
        <StatsCard
          title="Completed Reviews"
          value={stats.counts?.reviewedApplications || 0}
          iconName="CheckCircle2"
          description={`${completionRate}% completion rate`}
        />
        <StatsCard
          title="Total Reviews"
          value={stats.counts?.totalReviews || 0}
          iconName="ClipboardList"
          description="All-time reviews submitted"
        />
      </div>

      {/* ═══ SCORE GAUGE + SCORE STATS ═══ */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Score Gauge (1/3) */}
        <Card className="flex flex-col border-border/40 bg-card/60 shadow-sm backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <GaugeCircle className="h-5 w-5 text-[#0097b2]" />
              <h3 className="text-lg font-semibold text-foreground">
                Average Score
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Your overall scoring average
            </p>
          </CardHeader>
          <CardContent className="flex flex-1 items-center justify-center pb-6">
            <ScoreGauge
              score={stats.scores?.averageScore || 0}
              maxScore={stats.scores?.maxPossibleScore || 40}
              label="Average Review Score"
            />
          </CardContent>
        </Card>

        {/* Score Stats (2/3) */}
        <div className="lg:col-span-2">
          <Card className="h-full border-border/40 bg-card/60 shadow-sm backdrop-blur-xl">
            <CardHeader>
              <h3 className="text-lg font-semibold text-foreground">
                Score Summary
              </h3>
              <p className="text-xs text-muted-foreground">
                Your highest, lowest, and average scoring performance
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <ScoreStatPill
                label="Highest Score Given"
                value={stats.scores?.highestScore || 0}
                maxScore={stats.scores?.maxPossibleScore || 40}
                variant="high"
              />
              <ScoreStatPill
                label="Average Score Given"
                value={stats.scores?.averageScore || 0}
                maxScore={stats.scores?.maxPossibleScore || 40}
                variant="avg"
              />
              <ScoreStatPill
                label="Lowest Score Given"
                value={stats.scores?.lowestScore || 0}
                maxScore={stats.scores?.maxPossibleScore || 40}
                variant="low"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ═══ SCORE BREAKDOWN BAR + DISTRIBUTION PIE ═══ */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardBarChart
          data={scoreBreakdown}
          title="Average Score by Category"
          description="Your average scores across GPA, Essay, Financial, and Criteria"
          colors={["#0097b2", "#4b2875", "#2563eb", "#f59e0b"]}
        />
        <DashboardPieChart
          data={scoreDistribution}
          title="Score Quality Distribution"
          description="Breakdown of your reviews by score range"
          colors={["#10b981", "#0097b2", "#f59e0b", "#ef4444"]}
        />
      </div>

      {/* ═══ WORKLOAD COMPLETION VISUAL ═══ */}
      <Card className="border-border/40 bg-card/60 shadow-sm backdrop-blur-xl">
        <CardHeader>
          <h3 className="text-lg font-semibold text-foreground">
            Workload Progress
          </h3>
          <p className="text-xs text-muted-foreground">
            Your current review completion status
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Progress bar */}
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                {stats.counts?.reviewedApplications || 0} of {totalWork}{" "}
                reviews completed
              </span>
              <span
                className={`font-bold ${
                  completionRate >= 75
                    ? "text-emerald-600 dark:text-emerald-400"
                    : completionRate >= 50
                      ? "text-[#0097b2]"
                      : "text-amber-600 dark:text-amber-400"
                }`}
              >
                {completionRate}%
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted/50">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${completionRate}%`,
                  background:
                    completionRate >= 75
                      ? "#10b981"
                      : completionRate >= 50
                        ? "#0097b2"
                        : "#f59e0b",
                }}
              />
            </div>
            {/* Legend */}
            <div className="flex items-center gap-6 pt-1">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#0097b2]" />
                <span className="text-xs text-muted-foreground">
                  Reviewed ({stats.counts?.reviewedApplications || 0})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-muted" />
                <span className="text-xs text-muted-foreground">
                  Pending ({stats.counts?.pendingReviewApplications || 0})
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewerDashboardContent;