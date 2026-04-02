/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Building2,
  ChevronRight,
  Send,
  XCircle,
  Coins,
} from "lucide-react";
import Link from "next/link";

import { getMyApplications } from "@/services/application.services";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

// Status configuration for beautiful color-coded badges
const STATUS_CONFIG: Record<
  string,
  { label: string; icon: any; color: string; bg: string; border: string }
> = {
  DRAFT: { label: "Draft", icon: FileText, color: "#6b7280", bg: "#6b728015", border: "#6b728040" },
  SCREENING: { label: "Screening", icon: Search, color: "#3b82f6", bg: "#3b82f615", border: "#3b82f640" },
  UNDER_REVIEW: { label: "Under Review", icon: Clock, color: "#8b5cf6", bg: "#8b5cf615", border: "#8b5cf640" },
  APPROVED: { label: "Approved", icon: CheckCircle2, color: "#16a34a", bg: "#16a34a15", border: "#16a34a40" },
  REJECTED: { label: "Rejected", icon: XCircle, color: "#dc2626", bg: "#dc262615", border: "#dc262640" },
  DISBURSED: { label: "Disbursed", icon: Coins, color: "#d97706", bg: "#d9770615", border: "#d9770640" },
};

export default function MyApplications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // ── Fetch Applications ──
  const { data: response, isLoading } = useQuery({
    queryKey: ["my-applications"],
    queryFn: () => getMyApplications(),
  });

  // Handle nested data safely based on standard backend pagination formats
  const applications: any[] = Array.isArray(response?.data?.data) 
    ? response.data.data 
    : Array.isArray(response?.data) ? response.data : [];

  // ── Filtering ──
  const filteredApps = applications.filter((app) => {
    const matchesSearch = app.scholarship?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.scholarship?.university?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ── Quick Stats ──
  const totalApplied = applications.filter(a => a.status !== "DRAFT").length;
  const totalApproved = applications.filter(a => a.status === "APPROVED" || a.status === "DISBURSED").length;
  const totalPending = applications.filter(a => a.status === "SCREENING" || a.status === "UNDER_REVIEW").length;

  const formatCurrency = (amount: number) => {
    return `Tk ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount)}`;
  };

  if (isLoading) return <ApplicationsSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto space-y-8 pb-16"
    >
      {/* ─── Header & Stats ─── */}
      <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-end">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-foreground">
            <Send className="h-8 w-8" style={{ color: BRAND_PURPLE }} />
            My Applications
          </h1>
          <p className="mt-2 text-sm font-medium text-muted-foreground max-w-xl">
            Track the status of your scholarship applications and manage your drafts.
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <StatBox label="Total Applied" value={totalApplied} color={BRAND_PURPLE} />
          <StatBox label="Pending" value={totalPending} color="#8b5cf6" />
          <StatBox label="Approved" value={totalApproved} color="#16a34a" />
        </div>
      </div>

      {/* ─── Filters ─── */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-card/50 backdrop-blur-sm border border-border/40 p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by scholarship or university..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-11 rounded-xl bg-background border-border/50"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 h-11 rounded-xl bg-background border-border/50 font-semibold">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="All Statuses" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="DRAFT">Drafts</SelectItem>
            <SelectItem value="SCREENING">Screening</SelectItem>
            <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="DISBURSED">Disbursed</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ─── Applications List ─── */}
      {filteredApps.length === 0 ? (
        <EmptyState hasSearch={!!searchTerm || statusFilter !== "all"} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredApps.map((app, index) => {
              const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.UNDER_REVIEW;
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Link href={`/student/my-applications/${app.id}`}>
                    <Card className="group h-full flex flex-col rounded-2xl border-border/40 bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                      {/* Top Status Bar */}
                      <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: status.color }} />
                      
                      <div className="p-6 flex flex-col flex-1">
                        {/* Status Badge & Date */}
                        <div className="flex items-center justify-between mb-4">
                          <Badge 
                            className="font-bold text-[10px] uppercase tracking-wider px-2.5 py-1"
                            style={{ backgroundColor: status.bg, color: status.color, border: `1px solid ${status.border}` }}
                          >
                            <StatusIcon className="h-3 w-3 mr-1.5" />
                            {status.label}
                          </Badge>
                          <span className="text-xs font-bold text-muted-foreground">
                            {app.submittedAt 
                              ? `Submitted ${new Date(app.submittedAt).toLocaleDateString()}` 
                              : "Not Submitted"}
                          </span>
                        </div>

                        {/* Title & University */}
                        <div className="flex-1">
                          <h3 className="text-lg font-extrabold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {app.scholarship?.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm font-semibold text-muted-foreground truncate">
                              {app.scholarship?.university?.name || "University Wide"}
                            </span>
                          </div>
                        </div>

                        {/* Footer Details */}
                        <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between shrink-0">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Amount</p>
                            <p className="text-sm font-black text-foreground">
                              {formatCurrency(app.scholarship?.amountPerStudent || 0)}
                            </p>
                          </div>
                          
                          <div className="flex items-center text-sm font-bold text-primary group-hover:translate-x-1 transition-transform">
                            View Details <ChevronRight className="h-4 w-4 ml-1" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}


function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-muted/20 border border-border/40 rounded-xl px-4 py-3 min-w-25">
      <span className="text-2xl font-black" style={{ color }}>{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">{label}</span>
    </div>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed border-border/60 bg-muted/5"
    >
      <div className="mb-4 rounded-full bg-muted/30 p-5">
        {hasSearch ? (
          <Search className="h-10 w-10 text-muted-foreground" />
        ) : (
          <FileText className="h-10 w-10 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-xl font-bold text-foreground">
        {hasSearch ? "No applications found" : "You haven't applied yet"}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground mb-6">
        {hasSearch
          ? "Try adjusting your search terms or status filter."
          : "Start your journey by browsing available scholarships and submitting your first application!"}
      </p>
      {!hasSearch && (
        <Link href="/student/scholarships">
          <Button className="rounded-xl font-bold shadow-lg" style={{ background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})` }}>
            Browse Scholarships
          </Button>
        </Link>
      )}
    </motion.div>
  );
}

function ApplicationsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-20 w-24 rounded-xl" />
          <Skeleton className="h-20 w-24 rounded-xl" />
        </div>
      </div>
      <Skeleton className="h-16 w-full rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}