// src/app/(commonLayout)/universities/_components/PublicUniversitiesList.tsx

"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Building2,
  GraduationCap,
  Users,
  Layers,
  Globe,
  ArrowRight,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
} from "lucide-react";

import { getPublicUniversities } from "@/services/publicUniversity.services";
import type { IPublicUniversity } from "@/types/publicUniversity";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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

type SortOption = "name" | "-createdAt" | "-name";

export default function PublicUniversitiesList() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [page, setPage] = useState(1);

  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "12",
      sortBy,
    });
    if (searchTerm.trim()) params.set("searchTerm", searchTerm.trim());
    return params.toString();
  }, [page, sortBy, searchTerm]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["public-universities", queryString],
    queryFn: () => getPublicUniversities(queryString),
  });

  const universities = data?.data ?? [];
  const meta = data?.meta;
  const hasFilters = searchTerm.trim().length > 0;

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("name");
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* ─── Search & Sort ─── */}
      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search universities by name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 h-12 rounded-xl bg-background text-sm"
                />
              </div>
            </div>

            <div className="w-full sm:w-52">
              <Select
                value={sortBy}
                onValueChange={(v) => {
                  setSortBy(v as SortOption);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-12 rounded-xl text-sm font-semibold">
                  <SlidersHorizontal className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="-name">Name (Z-A)</SelectItem>
                  <SelectItem value="-createdAt">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {hasFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="h-12 rounded-xl font-semibold gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ─── Results Count ─── */}
      {meta && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-medium">
            Showing{" "}
            <span className="font-bold text-foreground">
              {universities.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-foreground">{meta.total}</span>{" "}
            universities
          </p>
        </div>
      )}

      {/* ─── Loading ─── */}
      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="rounded-2xl">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-11 w-full rounded-xl" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* ─── Empty ─── */}
      {!isLoading && universities.length === 0 && (
        <Card className="rounded-2xl">
          <CardContent className="pt-16 pb-16 text-center">
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: `${BRAND_TEAL}10` }}
            >
              <Building2
                className="h-10 w-10"
                style={{ color: BRAND_TEAL }}
              />
            </div>
            <h3 className="mt-6 text-xl font-bold">
              No universities found
            </h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              {hasFilters
                ? "Try adjusting your search to find more universities."
                : "No universities are available at the moment."}
            </p>
            {hasFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-6 rounded-xl font-bold"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* ─── Cards Grid ─── */}
      {!isLoading && universities.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {universities.map((university) => (
            <UniversityCard
              key={university.id}
              university={university}
              onClick={() => router.push(`/universities/${university.id}`)}
            />
          ))}
        </div>
      )}

      {/* ─── Pagination ─── */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isFetching}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl font-semibold gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === meta.totalPages ||
                  Math.abs(p - page) <= 1
              )
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-1.5 text-muted-foreground text-sm">
                      …
                    </span>
                  )}
                  <Button
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    className="w-9 h-9 rounded-xl font-bold"
                    onClick={() => setPage(p)}
                    disabled={isFetching}
                    style={
                      p === page
                        ? {
                            background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
                          }
                        : undefined
                    }
                  >
                    {p}
                  </Button>
                </span>
              ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPages || isFetching}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl font-semibold gap-1"
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
// University Card
// ═══════════════════════════════════════════

interface UniversityCardProps {
  university: IPublicUniversity;
  onClick: () => void;
}

function UniversityCard({ university, onClick }: UniversityCardProps) {
  return (
    <Card
      className="group flex flex-col rounded-2xl border-border/50 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Top Accent */}
      <div
        className="h-1 w-full transition-all duration-300 group-hover:h-1.5"
        style={{
          background: `linear-gradient(90deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
        }}
      />

      <CardHeader className="pb-3 pt-6">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-muted/30 border border-border/40 overflow-hidden shadow-sm">
            {university.logoUrl ? (
              <Image
                src={university.logoUrl}
                alt={university.name}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {university.name}
            </h3>

            <div className="flex items-center gap-2 mt-1.5">
              <Badge
                className="text-[10px] font-bold rounded-lg px-2 py-0.5"
                style={{
                  backgroundColor: `#16a34a15`,
                  color: "#16a34a",
                  border: "1px solid #16a34a40",
                }}
              >
                <CheckCircle2 className="h-3 w-3 mr-0.5" />
                Verified
              </Badge>

              {university.website && (
                <a
                  href={university.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-muted-foreground hover:text-primary hover:underline flex items-center gap-1 transition-colors"
                >
                  <Globe className="h-3 w-3" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          <StatItem
            icon={GraduationCap}
            value={university._count.scholarships}
            label="Scholarships"
            color={BRAND_TEAL}
          />
          <StatItem
            icon={Users}
            value={university._count.students}
            label="Students"
            color={BRAND_PURPLE}
          />
          <StatItem
            icon={Layers}
            value={university._count.departments}
            label="Departments"
            color="#f59e0b"
          />
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-5">
        <Button
          className="w-full h-11 rounded-xl font-bold text-white shadow-md transition-all group-hover:shadow-lg active:scale-[0.98]"
          style={{
            background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
          }}
        >
          View University
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// ─── Micro-component ───

function StatItem({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border/40 bg-muted/10 p-2.5 transition-colors hover:bg-muted/20">
      <div style={{ color }}>
        <Icon className="h-4 w-4 mb-1.5" />
      </div>
      <span className="text-lg font-black text-foreground">{value}</span>
      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}