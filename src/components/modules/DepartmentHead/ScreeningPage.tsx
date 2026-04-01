// components/modules/DepartmentHead/Screening/ScreeningPage.tsx

"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Search,
  Filter,
  User,
  GraduationCap,
  Calendar,
  Eye,
  Clock,
} from "lucide-react";

import { getApplicationsForScreening } from "@/services/screening.services";
import type { IScreeningApplication } from "@/types/screening";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ScreeningDialog from "./ScreeningDialog";

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

export default function ScreeningPage() {
  const [selectedApplication, setSelectedApplication] =
    useState<IScreeningApplication | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["screening-applications"],
    queryFn: () => getApplicationsForScreening(),
  });

  const applications: IScreeningApplication[] = Array.isArray(response?.data)
    ? response.data
    : [];

  const filtered = applications.filter((app) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      app.student?.user?.name?.toLowerCase().includes(term) ||
      app.student?.user?.email?.toLowerCase().includes(term) ||
      app.scholarship?.title?.toLowerCase().includes(term)
    );
  });

  const handleScreen = (application: IScreeningApplication) => {
    setSelectedApplication(application);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedApplication(null);
  };

  const handleScreeningSuccess = () => {
    handleDialogClose();
    refetch();
  };

  if (isLoading) return <ScreeningSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-7xl mx-auto space-y-8 pb-20 px-4 sm:px-6 lg:px-8"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-xl bg-primary/10 p-2.5">
              <ClipboardCheck className="h-6 w-6" style={{ color: BRAND_PURPLE }} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Application Screening
            </h1>
          </div>
          <p className="text-base font-medium text-muted-foreground ml-1">
            Review and screen applications pending for your department.
          </p>
        </div>
      </div>

      {/* Stats & Controls Top Bar */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        {/* Stats Widget */}
        <Card className="rounded-3xl p-5 border-border/50 shadow-sm bg-card/50 backdrop-blur-xl w-full lg:w-auto min-w-70">
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner"
              style={{ backgroundColor: `${BRAND_TEAL}15` }}
            >
              <ClipboardCheck className="h-6 w-6" style={{ color: BRAND_TEAL }} />
            </div>
            <div>
              <p className="text-3xl font-black text-foreground tracking-tight leading-none">
                {applications.length}
              </p>
              <p className="text-sm font-semibold text-muted-foreground mt-1 uppercase tracking-wider">
                Pending Screening
              </p>
            </div>
          </div>
        </Card>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-[320px] md:w-100">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or scholarship..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 rounded-2xl bg-muted/40 border-border/50 focus-visible:ring-primary/20 transition-all shadow-sm"
            />
          </div>
          <Badge
            variant="outline"
            className="h-12 px-5 rounded-2xl font-bold border-border/50 shadow-sm bg-card/50 backdrop-blur-sm whitespace-nowrap text-sm flex items-center"
          >
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            {filtered.length} Result{filtered.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      {/* Applications List */}
      {filtered.length === 0 ? (
        <EmptyState hasSearch={!!searchTerm.trim()} />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <ApplicationCard
                application={application}
                onScreen={() => handleScreen(application)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Screening Dialog */}
      <ScreeningDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        application={selectedApplication}
        onSuccess={handleScreeningSuccess}
      />
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// Application Card
// ═══════════════════════════════════════════
function ApplicationCard({
  application,
  onScreen,
}: {
  application: IScreeningApplication;
  onScreen: () => void;
}) {
  return (
    <Card className="rounded-3xl border-border/50 bg-card/50 backdrop-blur-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-6">
        
        {/* Left: Applicant Info */}
        <div className="flex items-center gap-5 flex-1 min-w-0 w-full">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#4b2875] to-[#0097b2] shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors" />
            <User className="h-6 w-6 text-white relative z-10" />
          </div>

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <h3 className="text-lg font-extrabold text-foreground truncate tracking-tight">
                {application.student?.user?.name}
              </h3>
              <p className="text-sm font-medium text-muted-foreground truncate">
                {application.student?.user?.email}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="font-bold text-xs gap-1.5 px-2.5 py-0.5 bg-secondary/60">
                <GraduationCap className="h-3.5 w-3.5 opacity-70" />
                <span className="truncate max-w-50 sm:max-w-75">
                  {application.scholarship?.title}
                </span>
              </Badge>

              <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 opacity-70" />
                {new Date(application.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Status & Actions */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-border/40">
          <Badge
            className="font-bold text-xs px-3.5 py-1.5 shadow-sm flex items-center gap-1.5"
            style={{
              backgroundColor: "#f59e0b15",
              color: "#d97706",
              border: "1px solid #f59e0b30",
            }}
          >
            <Clock className="h-3.5 w-3.5" />
            Pending Screening
          </Badge>

          <Button
            onClick={onScreen}
            className="h-10 px-6 rounded-xl font-bold text-white shadow-md hover:shadow-lg transition-all"
            style={{
              background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Screen Now
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════
// Empty State
// ═══════════════════════════════════════════
function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center px-4 rounded-3xl border border-dashed border-border/60 bg-muted/10"
    >
      <div className="mb-5 rounded-full bg-background p-5 shadow-sm border border-border/50">
        {hasSearch ? (
          <Search className="h-10 w-10 text-muted-foreground/60" />
        ) : (
          <ClipboardCheck className="h-10 w-10 text-muted-foreground/60" />
        )}
      </div>
      <h3 className="text-xl font-extrabold text-foreground tracking-tight">
        {hasSearch ? "No matching applications" : "All caught up!"}
      </h3>
      <p className="mt-2 max-w-md text-base text-muted-foreground font-medium">
        {hasSearch
          ? "We couldn't find any applications matching your search terms. Try adjusting your filters."
          : "There are no applications pending screening for your department at this time. Great job!"}
      </p>
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// Skeleton
// ═══════════════════════════════════════════
function ScreeningSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 pb-20">
      <div className="space-y-3 border-b border-border/40 pb-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-5 w-96 rounded-lg" />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 justify-between">
        <Skeleton className="h-24 w-full lg:w-64 rounded-3xl" />
        <div className="flex gap-3 w-full lg:w-auto">
          <Skeleton className="h-12 w-full sm:w-[320px] md:w-100 rounded-2xl" />
          <Skeleton className="h-12 w-32 rounded-2xl" />
        </div>
      </div>

      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-3xl w-full" />
        ))}
      </div>
    </div>
  );
}