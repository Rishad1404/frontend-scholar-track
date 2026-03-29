"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";

const BRAND = {
  teal: "#0097b2",
  purple: "#4b2875",
};

interface StatsCardProps {
  title: string;
  value: string | number;
  iconName: string;
  description?: string;
  trend?: number;
  trendText?: string;
  className?: string;
}

const StatsCard = ({
  title,
  value,
  iconName,
  description,
  trend,
  trendText,
  className,
}: StatsCardProps) => {
  const Icon = getIconComponent(iconName);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="h-full"
    >
      <Card
        className={cn(
          "group relative flex h-full flex-col overflow-hidden",
          "border-border/40 bg-card/60 shadow-sm backdrop-blur-xl",
          "transition-all duration-300",
          "hover:border-border/80 hover:shadow-lg",
          className
        )}
      >
        {/* Top gradient accent line */}
        <div
          className="absolute inset-x-0 top-0 h-0.5 w-full scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
          style={{
            background: `linear-gradient(90deg, ${BRAND.purple}, ${BRAND.teal})`,
          }}
        />

        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
          <CardTitle className="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            {title}
          </CardTitle>

          {/* Icon container — dark-mode aware */}
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm",
              "transition-transform duration-300 group-hover:scale-110",
              "bg-[#0097b2]/8 border border-[#0097b2]/12",
              "dark:bg-[#0097b2]/15 dark:border-[#0097b2]/20"
            )}
          >
            {Icon && (
              // eslint-disable-next-line react-hooks/static-components
              <Icon className="h-5 w-5 text-[#0097b2]" />
            )}
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col justify-end pb-5">
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-extrabold tracking-tight text-foreground">
              {value}
            </div>

            {/* Trend indicator — skips zero */}
            {trend !== undefined && trend !== 0 && (
              <div
                aria-label={`${trend > 0 ? "Up" : "Down"} ${Math.abs(trend)} percent`}
                className={cn(
                  "flex items-center rounded-md px-1.5 py-0.5 text-xs font-bold",
                  trend > 0
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                )}
              >
                {trend > 0 ? (
                  <TrendingUp className="mr-1 h-3 w-3" aria-hidden="true" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" aria-hidden="true" />
                )}
                {Math.abs(trend)}%
              </div>
            )}
          </div>

          {(description || trendText) && (
            <p className="mt-1.5 text-xs font-medium text-muted-foreground">
              {description || trendText}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;