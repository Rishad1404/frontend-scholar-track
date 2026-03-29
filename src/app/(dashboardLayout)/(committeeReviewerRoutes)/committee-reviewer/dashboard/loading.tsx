import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function SuperAdminDashboardLoading() {
  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4 border-b border-border/40 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-9 w-64 sm:w-80 rounded-lg" />
          <Skeleton className="h-4 w-48 sm:w-64" />
        </div>
        
        {/* Subtle branded syncing indicator */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-border/40 bg-muted/20 px-4 py-2">
          <Loader2 className="h-4 w-4 animate-spin" style={{ color: "#0097b2" }} />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Fetching System Data
          </span>
        </div>
      </div>

      {/* 2. Stats Grid (8 Cards for Super Admin metrics) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="border-border/40 bg-card/40 backdrop-blur-sm shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5">
              <Skeleton className="h-4 w-24" />
              {/* The icon placeholder */}
              <Skeleton className="h-10 w-10 rounded-xl" />
            </CardHeader>
            <CardContent className="pb-5">
              {/* The big number placeholder */}
              <Skeleton className="mb-2 h-8 w-20" />
              {/* The description text placeholder */}
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. Charts Grid (2 Large Placeholders) */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Bar Chart Placeholder (Spans 4 columns) */}
        <Card className="lg:col-span-4 border-border/40 bg-card/40 shadow-sm">
          <CardHeader>
            <Skeleton className="mb-2 h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-75 w-full rounded-2xl" />
          </CardContent>
        </Card>

        {/* Donut Chart Placeholder (Spans 3 columns) */}
        <Card className="lg:col-span-3 border-border/40 bg-card/40 shadow-sm">
          <CardHeader>
            <Skeleton className="mb-2 h-6 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent className="flex items-center justify-center h-75">
             {/* Circular skeleton for the Donut chart */}
            <Skeleton className="h-55 w-55 rounded-full" />
          </CardContent>
        </Card>
      </div>

    </div>
  );
}