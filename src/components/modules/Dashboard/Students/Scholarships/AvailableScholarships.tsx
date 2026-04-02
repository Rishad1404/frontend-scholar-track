"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Search,
  Filter,
  DollarSign,
  Users,
  BookOpen,
  Building2,
  Clock,
  Eye,
  TrendingUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllScholarships } from "@/services/scholarshipForStudents.services";
import { IScholarship } from "@/types/scholarshipForStudents";
import ScholarshipDetailDialog from "./ScholarshipDetailsDialog";

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

export default function AvailableScholarships() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScholarship, setSelectedScholarship] = useState<IScholarship | null>(
    null,
  );
  const [detailOpen, setDetailOpen] = useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ["student-scholarships"],
    queryFn: () => getAllScholarships(),
  });

  const scholarships: IScholarship[] = Array.isArray(response?.data) ? response.data : [];

  // ── Filter ──
  const filtered = scholarships.filter((s) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.title?.toLowerCase().includes(term) ||
      s.description?.toLowerCase().includes(term) ||
      s.university?.name?.toLowerCase().includes(term) ||
      s.department?.name?.toLowerCase().includes(term)
    );
  });

  const handleView = (scholarship: IScholarship) => {
    setSelectedScholarship(scholarship);
    setDetailOpen(true);
  };

  // ── Helpers ──
  const formatCurrency = (amount: number) => {
    return `Tk ${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount)}`;
  };

  const getDaysRemaining = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  if (isLoading) return <ScholarshipsSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-6xl mx-auto space-y-8 pb-16"
    >
      {/* ─── Header ─── */}
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-foreground">
          <GraduationCap className="h-8 w-8" style={{ color: BRAND_PURPLE }} />
          Available Scholarships
        </h1>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          Browse and apply for scholarships available at your university.
        </p>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard
          label="Available"
          value={scholarships.length}
          color={BRAND_TEAL}
          icon={GraduationCap}
        />
        <StatCard
          label="Total Funding"
          value={formatCurrency(scholarships.reduce((sum, s) => sum + s.totalAmount, 0))}
          color={BRAND_PURPLE}
          icon={DollarSign}
          isString
        />
        <StatCard
          label="Total Slots"
          value={scholarships.reduce((sum, s) => sum + s.quota, 0)}
          color="#16a34a"
          icon={Users}
        />
      </div>

      {/* ─── Search ─── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, university, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-muted/30"
          />
        </div>
        <Badge variant="outline" className="h-11 px-4 rounded-xl font-bold">
          <Filter className="h-4 w-4 mr-2" />
          {filtered.length} Scholarship{filtered.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* ─── Scholarships Grid ─── */}
      {filtered.length === 0 ? (
        <EmptyState hasSearch={!!searchTerm.trim()} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((scholarship, index) => (
            <motion.div
              key={scholarship.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ScholarshipCard
                scholarship={scholarship}
                onView={() => handleView(scholarship)}
                formatCurrency={formatCurrency}
                getDaysRemaining={getDaysRemaining}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* ─── Detail Dialog ─── */}
      <ScholarshipDetailDialog
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedScholarship(null);
        }}
        scholarship={selectedScholarship}
        formatCurrency={formatCurrency}
        getDaysRemaining={getDaysRemaining}
      />
    </motion.div>
  );
}

// ═══════════════════════════════════════════
// Scholarship Card
// ═══════════════════════════════════════════
function ScholarshipCard({
  scholarship,
  onView,
  formatCurrency,
  getDaysRemaining,
}: {
  scholarship: IScholarship;
  onView: () => void;
  formatCurrency: (n: number) => string;
  getDaysRemaining: (d: string) => number;
}) {
  const daysLeft = getDaysRemaining(scholarship.deadline);
  const isUrgent = daysLeft <= 7 && daysLeft > 0;
  const isExpired = daysLeft <= 0;

  return (
    <Card className="rounded-2xl border-border/40 shadow-sm hover:shadow-lg transition-all overflow-hidden group flex flex-col h-105">
      {/* Top gradient */}
      <div
        className="h-1.5 w-full shrink-0"
        style={{
          background: `linear-gradient(90deg, #0097b2, #4b2875)`,
        }}
      />

      <div className="p-6 flex flex-col flex-1">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3 mb-4 shrink-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-extrabold text-foreground line-clamp-1 group-hover:text-[#4b2875] transition-colors">
              {scholarship.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground truncate">
                {scholarship.university?.name}
              </span>
            </div>
          </div>

          {/* Deadline Badge */}
          {isExpired ? (
            <Badge variant="destructive" className="shrink-0 font-bold text-[10px]">
              Expired
            </Badge>
          ) : isUrgent ? (
            <Badge
              className="shrink-0 font-bold text-[10px]"
              style={{
                backgroundColor: "#dc262615",
                color: "#dc2626",
                border: "1px solid #dc262640",
              }}
            >
              <Clock className="h-3 w-3 mr-1" />
              {daysLeft}d left
            </Badge>
          ) : (
            <Badge variant="secondary" className="shrink-0 font-bold text-[10px]">
              <Clock className="h-3 w-3 mr-1" />
              {daysLeft}d left
            </Badge>
          )}
        </div>

        {/* ── Middle Content (Grows to push footer down) ── */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {scholarship.description || "No description provided."}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4 overflow-hidden max-h-6.5">
            {scholarship.department && (
              <Badge variant="outline" className="text-[10px] font-semibold gap-1 px-2 py-0">
                <BookOpen className="h-3 w-3" />
                <span className="truncate max-w-25">{scholarship.department.name}</span>
              </Badge>
            )}
            {scholarship.level && (
              <Badge variant="outline" className="text-[10px] font-semibold gap-1 px-2 py-0">
                <TrendingUp className="h-3 w-3" />
                <span className="truncate max-w-20">{scholarship.level.name}</span>
              </Badge>
            )}
            {scholarship.financialNeedRequired && (
              <Badge
                variant="outline"
                className="text-[10px] font-semibold gap-1 px-2 py-0 text-amber-600 border-amber-300 shrink-0"
              >
                <DollarSign className="h-3 w-3" />
                Need Based
              </Badge>
            )}
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-3 gap-2 mt-auto shrink-0">
            <div className="rounded-xl bg-muted/20 border border-border/30 p-2 text-center flex flex-col justify-center h-15">
              <p className="text-[10px] font-bold text-muted-foreground">Amount</p>
              <p className="text-xs font-extrabold text-foreground mt-0.5 truncate px-1">
                {formatCurrency(scholarship.amountPerStudent)}
              </p>
            </div>
            <div className="rounded-xl bg-muted/20 border border-border/30 p-2 text-center flex flex-col justify-center h-15">
              <p className="text-[10px] font-bold text-muted-foreground">Slots</p>
              <p className="text-xs font-extrabold text-foreground mt-0.5">
                {scholarship.quota}
              </p>
            </div>
            <div className="rounded-xl bg-muted/20 border border-border/30 p-2 text-center flex flex-col justify-center h-15">
              <p className="text-[10px] font-bold text-muted-foreground">Deadline</p>
              <p className="text-xs font-extrabold text-foreground mt-0.5">
                {new Date(scholarship.deadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* ── Footer / Button ── */}
        <div className="mt-4 pt-4 border-t border-border/40 shrink-0">
          <Button
            onClick={onView}
            className="w-full rounded-xl font-bold text-white shadow"
            style={{
              background: `linear-gradient(135deg, #4b2875, #0097b2)`,
            }}
            disabled={isExpired}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isExpired ? "Deadline Passed" : "View Details & Apply"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════
// Sub-Components
// ═══════════════════════════════════════════
function StatCard({
  label,
  value,
  color,
  icon: Icon,
  isString = false,
}: {
  label: string;
  value: number | string;
  color: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  isString?: boolean;
}) {
  return (
    <Card className="rounded-2xl p-5 border-border/40">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-black text-foreground">
            {isString ? value : value}
          </p>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-4 rounded-full bg-muted/30 p-4">
        {hasSearch ? (
          <Search className="h-10 w-10 text-muted-foreground" />
        ) : (
          <GraduationCap className="h-10 w-10 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-bold text-foreground">
        {hasSearch ? "No matching scholarships" : "No scholarships available"}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {hasSearch
          ? "Try adjusting your search terms."
          : "There are no active scholarships at your university right now. Check back later!"}
      </p>
    </motion.div>
  );
}

function ScholarshipsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-11 w-96 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
