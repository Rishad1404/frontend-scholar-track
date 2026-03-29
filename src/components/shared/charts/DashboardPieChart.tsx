/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartItem } from "@/types/dashboard.types";
import { cn } from "@/lib/utils";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// ─── Brand palette ───
const PIE_COLORS = [
  "#0097b2", // teal (brand)
  "#4b2875", // purple (brand)
  "#2563eb", // blue
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // rose
  "#8b5cf6", // violet
  "#06b6d4", // cyan
];

interface DashboardPieChartProps {
  data: ChartItem[];
  title?: string;
  description?: string;
  className?: string;
  donut?: boolean; // donut vs solid pie
  showLabels?: boolean;
  height?: number;
  colors?: string[]; // override colors
}

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  const { name, value } = payload[0];
  const percent = payload[0]?.percent ?? 0;

  return (
    <div className="rounded-xl border border-border/60 bg-background/95 px-3 py-2.5 shadow-xl backdrop-blur-sm">
      <p className="text-sm font-semibold text-foreground">{name}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">
        Count:{" "}
        <span className="font-semibold text-foreground">{value}</span>
        <span className="ml-1 text-muted-foreground/70">
          ({(percent * 100).toFixed(1)}%)
        </span>
      </p>
    </div>
  );
};

/* ── Custom Legend ── */
const CustomLegend = ({ payload }: any) => {
  if (!payload?.length) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-1.5">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs font-medium text-muted-foreground">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ── Empty State ── */
const EmptyState = ({
  title,
  description,
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) => (
  <Card className={className}>
    <CardHeader>
      {title && <CardTitle>{title}</CardTitle>}
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent className="flex h-75 flex-col items-center justify-center text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <svg
          className="h-6 w-6 text-muted-foreground"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="9" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeWidth={1.5} d="M12 3a9 9 0 0 1 0 18" />
        </svg>
      </div>
      <p className="text-sm font-medium text-foreground">No data available</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Data will appear here once records exist.
      </p>
    </CardContent>
  </Card>
);

const DashboardPieChart = ({
  data,
  title,
  description,
  className,
  donut = true,
  showLabels = false,
  height = 300,
  colors = PIE_COLORS,
}: DashboardPieChartProps) => {
  // Error state
  if (!data || !Array.isArray(data)) {
    return (
      <EmptyState
        title={title}
        description={description}
        className={className}
      />
    );
  }

  // Empty state
  if (!data.length || data.every((item) => item.value === 0)) {
    return (
      <EmptyState
        title={title}
        description={description}
        className={className}
      />
    );
  }

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        {title && <CardTitle>{title}</CardTitle>}
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={donut ? 55 : 0}
              outerRadius={90}
              paddingAngle={donut ? 4 : 1}
              dataKey="value"
              nameKey="name"
              labelLine={showLabels}
              label={
                showLabels
                  ? ({ name, percent }) =>
                      `${name} ${((percent as number) * 100).toFixed(0)}%`
                  : false
              }
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                  className="stroke-background"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardPieChart;