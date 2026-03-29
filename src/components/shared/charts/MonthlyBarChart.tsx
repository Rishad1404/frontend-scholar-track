/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BRAND_TEAL = "#0097b2";

interface MonthlyDataItem {
  month: string | Date;
  count?: number;
  total?: number;
}

interface MonthlyBarChartProps {
  data: MonthlyDataItem[];
  title?: string;
  description?: string;
  className?: string;
  valueKey?: "count" | "total";
  valueLabel?: string;
  color?: string;
  height?: number;
  isCurrency?: boolean;
  currencySymbol?: string;
}

/* ── Safe date formatting ── */
function formatMonth(value: string | Date): string {
  try {
    const date = typeof value === "string" ? parseISO(value) : value;
    return format(date, "MMM yyyy");
  } catch {
    return String(value);
  }
}

/* ── Format value for display ── */
function formatValue(
  value: number,
  isCurrency: boolean,
  symbol: string
): string {
  if (isCurrency) {
    if (value >= 1_000_000) return `${symbol}${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${symbol}${(value / 1_000).toFixed(1)}K`;
    return `${symbol}${value.toLocaleString()}`;
  }
  return value.toLocaleString();
}

/* ── Custom Tooltip ── */
const CustomTooltip = ({
  active,
  payload,
  label,
  valueLabel,
  isCurrency,
  currencySymbol,
}: any) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-background/95 px-3 py-2.5 shadow-xl backdrop-blur-sm">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: payload[0]?.color || BRAND_TEAL }}
        />
        <p className="text-sm text-muted-foreground">
          {valueLabel || "Count"}:{" "}
          <span className="font-semibold text-foreground">
            {isCurrency
              ? `${currencySymbol}${payload[0].value.toLocaleString()}`
              : payload[0].value.toLocaleString()}
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
      <p className="text-sm font-medium text-foreground">No monthly data yet</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Trends will appear here over time.
      </p>
    </CardContent>
  </Card>
);

const MonthlyBarChart = ({
  data,
  title,
  description,
  className,
  valueKey = "count",
  valueLabel = "Applications",
  color = BRAND_TEAL,
  height = 350,
  isCurrency = false,
  currencySymbol = "৳",
}: MonthlyBarChartProps) => {
  if (!data || !Array.isArray(data)) {
    return (
      <EmptyState title={title} description={description} className={className} />
    );
  }

  const formattedData = data.map((item) => ({
    month: formatMonth(item.month),
    value: Number(item[valueKey]) || 0,
  }));

  if (!formattedData.length || formattedData.every((item) => item.value === 0)) {
    return (
      <EmptyState title={title} description={description} className={className} />
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
            data={formattedData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-border/40"
            />
            <XAxis
              dataKey="month"
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
              tickFormatter={(value) =>
                isCurrency
                  ? formatValue(value, true, currencySymbol)
                  : value.toLocaleString()
              }
            />
            <Tooltip
              content={
                <CustomTooltip
                  valueLabel={valueLabel}
                  isCurrency={isCurrency}
                  currencySymbol={currencySymbol}
                />
              }
              cursor={{ className: "fill-muted/30" }}
            />
            <Bar
              dataKey="value"
              fill={color}
              radius={[8, 8, 0, 0]}
              maxBarSize={48}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyBarChart;