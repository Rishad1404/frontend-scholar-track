/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// src/app/(commonLayout)/scholarships/_components/PublicScholarshipsList.tsx

"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNow } from "date-fns";
import Image from "next/image";
import {
  Search,
  DollarSign,
  Calendar,
  Building2,
  Clock,
  AlertCircle,
  ArrowRight,
  BookOpen,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { getPublicScholarships } from "@/services/publicScholarship.services";
import { getAllUniversities } from "@/services/university.services"; // Make sure this service exists!
import type { IPublicScholarship } from "@/types/publicScholarship";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

type SortOption = "deadline" | "-amountPerStudent" | "-createdAt";

export default function PublicScholarshipsList() {
  const router = useRouter();

  // ─── States ───
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const [sortBy, setSortBy] = useState<SortOption>("deadline");
  const [universityId, setUniversityId] = useState<string>("all");
  const [page, setPage] = useState(1);

  // ─── Debounce Search Term ───
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ─── Build Query String ───
  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "12",
      sortBy,
    });
    
    if (debouncedSearch.trim()) params.set("searchTerm", debouncedSearch.trim());
    if (universityId !== "all") params.set("universityId", universityId);
    
    return params.toString();
  }, [page, sortBy, debouncedSearch, universityId]);

  // ─── Data Fetching ───
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["public-scholarships", queryString],
    queryFn: () => getPublicScholarships(queryString),
  });

  const { data: uniRes } = useQuery({
    queryKey: ["universities-dropdown"],
    queryFn: () => getAllUniversities("limit=100"),
  });

  const scholarships = data?.data ?? [];
  const meta = data?.meta;
  const universities = uniRes?.data ?? [];

  const hasFilters = debouncedSearch.trim().length > 0 || universityId !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setSortBy("deadline");
    setUniversityId("all");
    setPage(1);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* ─── Premium Control Panel (Search & Filters) ─── */}
      <div className="rounded-[2rem] border border-border/50 bg-card p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center gap-4 justify-between">
          
          {/* LEFT: Professional Search Bar */}
          <div className="w-full lg:flex-1 max-w-2xl relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              placeholder="Search scholarships by title, keyword, or program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 pl-14 pr-6 rounded-2xl bg-background border-border/60 text-base shadow-inner focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50 transition-all w-full"
            />
          </div>

          {/* RIGHT: Filters & Sort */}
          <div className="w-full lg:w-auto flex flex-wrap items-center justify-end gap-3 shrink-0">
            
            {/* University Filter */}
            <Select value={universityId} onValueChange={(v) => { setUniversityId(v); setPage(1); }}>
              <SelectTrigger className="h-14 w-full sm:w-60 rounded-2xl bg-background border-border/60 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-primary/30 transition-all">
                <div className="flex items-center gap-2 truncate">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate">
                    {universityId === "all" ? "All Universities" : universities.find((u: any) => u.id === universityId)?.name || "University"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50 shadow-xl max-h-75">
                <SelectItem value="all" className="font-medium py-3">All Universities</SelectItem>
                {universities.map((u: any) => (
                  <SelectItem key={u.id} value={u.id} className="font-medium py-3">
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(v) => { setSortBy(v as SortOption); setPage(1); }}>
              <SelectTrigger className="h-14 w-full sm:w-[200px] rounded-2xl bg-background border-border/60 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-primary/30 transition-all">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50 shadow-xl">
                <SelectItem value="deadline" className="font-medium py-3">Deadline (Soonest)</SelectItem>
                <SelectItem value="-createdAt" className="font-medium py-3">Newly Added</SelectItem>
                <SelectItem value="-amountPerStudent" className="font-medium py-3">Amount (Highest)</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Button */}
            {hasFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="h-14 w-14 p-0 rounded-2xl bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition-all shrink-0"
                title="Clear Filters"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Results Count ─── */}
      {meta && !isLoading && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground font-medium">
            Showing <span className="font-black text-foreground">{scholarships.length}</span> of{" "}
            <span className="font-black text-foreground">{meta.total}</span> opportunities
          </p>
        </div>
      )}

      {/* ─── Loading State ─── */}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/50 bg-card p-6 h-[420px] flex flex-col shadow-sm">
              <Skeleton className="h-10 w-10 rounded-xl mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-6" />
              <Skeleton className="h-20 w-full mb-auto" />
              <Skeleton className="h-11 w-full rounded-xl mt-6" />
            </div>
          ))}
        </div>
      )}

      {/* ─── Empty State ─── */}
      {!isLoading && scholarships.length === 0 && (
        <div className="rounded-2xl border border-border/50 bg-card p-16 text-center shadow-sm max-w-2xl mx-auto mt-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-6">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-foreground">No scholarships found</h3>
          <p className="text-muted-foreground mt-3 font-medium leading-relaxed">
            {hasFilters
              ? "Try adjusting your search or filter criteria to uncover more opportunities."
              : "There are no active scholarships at the moment. Please check back later!"}
          </p>
          {hasFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-8 rounded-xl font-bold h-11 px-8 border-border/50 shadow-sm hover:bg-muted"
            >
              Reset Search
            </Button>
          )}
        </div>
      )}

      {/* ─── Scholarship Cards Grid ─── */}
      {!isLoading && scholarships.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {scholarships.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              onClick={() => router.push(`/scholarships/${scholarship.id}`)}
            />
          ))}
        </div>
      )}

      {/* ─── Professional Pagination ─── */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8 pb-4">
          <Button
            variant="outline"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => p - 1)}
            className="h-11 px-4 rounded-xl font-bold gap-2 border-border/50 bg-card hover:bg-muted shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>

          <div className="flex items-center gap-1.5 px-2 hidden sm:flex">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === meta.totalPages || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-2 text-muted-foreground font-bold">…</span>
                  )}
                  <Button
                    variant={p === page ? "default" : "outline"}
                    className={`h-11 w-11 rounded-xl font-black text-sm transition-all ${
                      p !== page ? "border-border/50 bg-card hover:bg-muted shadow-sm" : "shadow-md scale-105"
                    }`}
                    onClick={() => setPage(p)}
                    disabled={isFetching}
                    style={p === page ? { background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`, color: 'white', border: 'none' } : undefined}
                  >
                    {p}
                  </Button>
                </span>
              ))}
          </div>

          <Button
            variant="outline"
            disabled={page >= meta.totalPages || isFetching}
            onClick={() => setPage((p) => p + 1)}
            className="h-11 px-4 rounded-xl font-bold gap-2 border-border/50 bg-card hover:bg-muted shadow-sm"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// Professional Scholarship Card
// ═══════════════════════════════════════════

interface ScholarshipCardProps {
  scholarship: IPublicScholarship;
  onClick: () => void;
}

function ScholarshipCard({ scholarship, onClick }: ScholarshipCardProps) {
  const deadlineDate = new Date(scholarship.deadline);

  const { isExpired, daysLeft, isUrgent } = useMemo(() => {
    const now = Date.now();
    const expired = deadlineDate.getTime() < now;
    const days = Math.ceil((deadlineDate.getTime() - now) / (1000 * 60 * 60 * 24));
    const urgent = !expired && days <= 7;
    return { isExpired: expired, daysLeft: days, isUrgent: urgent };
  }, [deadlineDate]);

  return (
    <div
      className="group relative flex flex-col h-[420px] rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Top Accent Line */}
      <div
        className="h-1 w-full shrink-0 transition-all duration-500 group-hover:h-1.5"
        style={{
          background: isExpired ? "#ef4444" : `linear-gradient(90deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
        }}
      />

      <div className="p-6 flex flex-col flex-1">
        {/* Header (Logo + Univ Name) */}
        <div className="flex items-center gap-3 mb-4 shrink-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/50 border border-border/50 overflow-hidden">
            {scholarship.university.logoUrl ? (
              <Image
                src={scholarship.university.logoUrl}
                alt={scholarship.university.name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <span className="text-xs font-bold text-muted-foreground truncate uppercase tracking-wider">
            {scholarship.university.name}
          </span>
        </div>

        {/* Title & Tags */}
        <div className="shrink-0 mb-4">
          <h3 className="text-lg font-black leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {scholarship.title}
          </h3>
          <div className="flex flex-wrap gap-2 mt-3 overflow-hidden max-h-[28px]">
            {scholarship.department && (
              <Badge variant="secondary" className="text-[10px] font-bold rounded-md px-2 py-0.5 bg-muted">
                {scholarship.department.name}
              </Badge>
            )}
            {scholarship.level && (
              <Badge variant="secondary" className="text-[10px] font-bold rounded-md px-2 py-0.5 bg-muted">
                {scholarship.level.name}
              </Badge>
            )}
          </div>
        </div>

        {/* Middle Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <p className="text-sm font-medium text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
            {scholarship.description || "Discover if you are eligible for this prestigious funding opportunity."}
          </p>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mt-auto shrink-0 mb-4">
            <StatItem icon={DollarSign} label="Amount" value={`৳${scholarship.amountPerStudent.toLocaleString()}`} color={BRAND_TEAL} />
            <StatItem icon={Calendar} label="Deadline" value={format(deadlineDate, "MMM dd, yyyy")} color={isExpired ? "#ef4444" : BRAND_PURPLE} />
          </div>

          {/* Urgency Tracker */}
          <div className="shrink-0 h-5 flex items-center">
            {!isExpired && isUrgent && (
              <div className="flex items-center gap-1.5 text-rose-500">
                <AlertCircle className="h-3.5 w-3.5 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider">
                  {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
                </span>
              </div>
            )}
            {!isExpired && !isUrgent && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Closes {formatDistanceToNow(deadlineDate, { addSuffix: true })}
                </span>
              </div>
            )}
            {isExpired && (
              <Badge variant="destructive" className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5">
                Closed
              </Badge>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-border/50 shrink-0">
          <Button
            className="w-full h-11 rounded-xl font-bold text-white shadow-sm transition-all duration-300 group-hover:shadow-md relative overflow-hidden"
            style={isExpired ? { background: "#6b7280" } : { background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})` }}
            disabled={isExpired}
          >
            <span className="relative z-10 flex items-center">
              {isExpired ? "Applications Closed" : "View Details"}
              {!isExpired && <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Micro-component ───

function StatItem({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border/40 bg-muted/30 p-2.5">
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg shadow-sm"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="text-xs font-black text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}