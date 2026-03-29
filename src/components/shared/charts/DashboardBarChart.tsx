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
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DEFAULT_COLORS = [
  "#0097b2",
  "#4b2875",
  "#2563eb",
  "#f59e0b",
  "#10b981",
  "#ef4444",
];

interface DashboardBarChartProps {
  data: ChartItem[];
  title?: string;
  description?: string;
  className?: string;
  singleColor?: boolean;
  color?: string;
  colors?: string[];  // ← NEW: per-bar color override
  height?: number;
}

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-background/95 px-3 py-2.5 shadow-xl backdrop-blur-sm">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor:
              payload[0]?.payload?.fill || DEFAULT_COLORS[0],
          }}
        />
        <p className="text-sm text-muted-foreground">
          Count:{" "}
          <span className="font-semibold text-foreground">
            {payload[0].value.toLocaleString()}
          </span>
        </p>
      </div>
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 13h2v8H3zm6-4h2v12H9zm6-3h2v15h-2zm6-2h2v17h-2z"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-foreground">No data available</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Data will appear here once records exist.
      </p>
    </CardContent>
  </Card>
);

const DashboardBarChart = ({
  data,
  title,
  description,
  className,
  singleColor = false,
  color = DEFAULT_COLORS[0],
  colors,
  height = 350,
}: DashboardBarChartProps) => {
  // Determine which color palette to use
  const barColors = colors || DEFAULT_COLORS;

  if (!data || !Array.isArray(data)) {
    return (
      <EmptyState
        title={title}
        description={description}
        className={className}
      />
    );
  }

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
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-border/40"
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              className="fill-muted-foreground text-xs"
              dy={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              className="fill-muted-foreground text-xs"
              dx={-10}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ className: "fill-muted/30" }}
            />
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
              animationDuration={1200}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    singleColor
                      ? color
                      : barColors[index % barColors.length]
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DashboardBarChart;