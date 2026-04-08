/* eslint-disable @typescript-eslint/no-require-imports */
// src/app/(commonLayout)/universities/[id]/_components/UniversityDetail.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Building2,
  Globe,
  GraduationCap,
  Users,
  Layers,
  UserCog,
  Shield,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

import { getPublicUniversityById } from "@/services/publicUniversity.services";
import { getPublicScholarships } from "@/services/publicScholarship.services";
import type { IPublicScholarship } from "@/types/publicScholarship";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

interface Props {
  universityId: string;
}

export default function UniversityDetail({ universityId }: Props) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-university", universityId],
    queryFn: () => getPublicUniversityById(universityId),
  });

  // Fetch active scholarships from this university
  const { data: scholarshipsData } = useQuery({
    queryKey: ["public-university-scholarships", universityId],
    queryFn: () =>
      getPublicScholarships(`universityId=${universityId}&limit=6&sortBy=deadline`),
    enabled: !!universityId,
  });

  const scholarships = scholarshipsData?.data ?? [];

  if (isLoading) return <DetailSkeleton />;

  if (isError || !data?.data) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-4">
        <Button variant="ghost" asChild className="font-bold">
          <Link href="/universities">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Universities
          </Link>
        </Button>
        <Card className="rounded-2xl">
          <CardContent className="pt-16 pb-16 text-center">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground/30" />
            <h2 className="mt-6 text-2xl font-bold">
              University Not Found
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              This university may not be available or has not been verified
              yet.
            </p>
            <Button
              asChild
              className="mt-6 rounded-xl font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
              }}
            >
              <Link href="/universities">Browse All Universities</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const uni = data.data;

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {/* Back */}
      <Button variant="ghost" asChild className="font-bold mb-6">
        <Link href="/universities">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Universities
        </Link>
      </Button>

      {/* ─── Hero Card ─── */}
      <Card className="rounded-2xl overflow-hidden mb-8">
        <div
          className="h-2"
          style={{
            background: `linear-gradient(90deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
          }}
        />
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Logo */}
            <div className="flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center rounded-2xl bg-muted/30 border-2 border-border/40 overflow-hidden shadow-md">
              {uni.logoUrl ? (
                <Image
                  src={uni.logoUrl}
                  alt={uni.name}
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-12 w-12 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {uni.name}
              </h1>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
                <Badge
                  className="text-xs font-bold rounded-lg px-3 py-1 gap-1"
                  style={{
                    backgroundColor: "#16a34a15",
                    color: "#16a34a",
                    border: "1px solid #16a34a40",
                  }}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified Institution
                </Badge>

                {uni.website && (
                  <a
                    href={uni.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary hover:underline flex items-center gap-1.5 transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    {uni.website.replace(/https?:\/\//, "")}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {/* Quick Stats Row */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 font-semibold">
                  <GraduationCap className="h-4 w-4" style={{ color: BRAND_TEAL }} />
                  {uni.activeScholarshipsCount} Active Scholarships
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <Users className="h-4 w-4" style={{ color: BRAND_PURPLE }} />
                  {uni._count.students} Students
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <Layers className="h-4 w-4" style={{ color: "#f59e0b" }} />
                  {uni._count.departments} Departments
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ─── Main Content ─── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Scholarships */}
          <Card className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <GraduationCap
                      className="h-5 w-5"
                      style={{ color: BRAND_TEAL }}
                    />
                    Active Scholarships
                  </CardTitle>
                  <CardDescription>
                    Currently accepting applications
                  </CardDescription>
                </div>
                {scholarships.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="font-bold"
                  >
                    <Link
                      href={`/scholarships?universityId=${universityId}`}
                    >
                      View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {scholarships.length === 0 ? (
                <div className="text-center py-10">
                  <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/30" />
                  <p className="mt-3 text-sm text-muted-foreground font-medium">
                    No active scholarships at the moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scholarships.map((scholarship) => (
                    <ScholarshipRow
                      key={scholarship.id}
                      scholarship={scholarship}
                      onClick={() =>
                        router.push(`/scholarships/${scholarship.id}`)
                      }
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Departments */}
          {uni.departments.length > 0 && (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Layers
                    className="h-5 w-5"
                    style={{ color: "#f59e0b" }}
                  />
                  Departments ({uni.departments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {uni.departments.map((dept) => (
                    <div
                      key={dept.id}
                      className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3.5 shadow-sm transition-colors hover:bg-muted/10"
                    >
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: "#f59e0b12" }}
                      >
                        <Layers
                          className="h-4 w-4"
                          style={{ color: "#f59e0b" }}
                        />
                      </div>
                      <span className="text-sm font-bold text-foreground truncate">
                        {dept.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Academic Levels */}
          {uni.academicLevels.length > 0 && (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <GraduationCap
                    className="h-5 w-5"
                    style={{ color: "#8b5cf6" }}
                  />
                  Academic Levels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2.5">
                  {uni.academicLevels.map((level) => (
                    <Badge
                      key={level.id}
                      variant="outline"
                      className="text-sm font-bold px-4 py-2 rounded-xl"
                    >
                      {level.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ─── Sidebar ─── */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card className="rounded-2xl sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                At a Glance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SidebarStat
                icon={GraduationCap}
                label="Active Scholarships"
                value={uni.activeScholarshipsCount}
                color={BRAND_TEAL}
              />
              <SidebarStat
                icon={GraduationCap}
                label="Total Scholarships"
                value={uni._count.scholarships}
                color="#8b5cf6"
              />

              <Separator />

              <SidebarStat
                icon={Users}
                label="Enrolled Students"
                value={uni._count.students}
                color={BRAND_PURPLE}
              />
              <SidebarStat
                icon={Layers}
                label="Departments"
                value={uni._count.departments}
                color="#f59e0b"
              />

              <Separator />

              <SidebarStat
                icon={UserCog}
                label="Administrators"
                value={uni._count.admins}
                color="#6366f1"
              />
              <SidebarStat
                icon={Shield}
                label="Reviewers"
                value={uni._count.reviewers}
                color="#0ea5e9"
              />
            </CardContent>
          </Card>

          {/* CTA */}
          {uni.activeScholarshipsCount > 0 && (
            <Card
              className="rounded-2xl border-primary/30 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${BRAND_PURPLE}08, ${BRAND_TEAL}08)`,
              }}
            >
              <CardContent className="pt-6 text-center space-y-4">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${BRAND_TEAL}15` }}
                >
                  <GraduationCap
                    className="h-7 w-7"
                    style={{ color: BRAND_TEAL }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    {uni.activeScholarshipsCount} Scholarship
                    {uni.activeScholarshipsCount !== 1 ? "s" : ""} Available
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Browse and apply for scholarships from{" "}
                    {uni.name}.
                  </p>
                </div>
                <Button
                  asChild
                  className="w-full h-12 rounded-xl font-black text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
                  }}
                >
                  <Link href={`/scholarships`}>
                    Browse Scholarships
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Website CTA */}
          {uni.website && (
            <Card className="rounded-2xl">
              <CardContent className="pt-6">
                <a
                  href={uni.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all hover:bg-primary/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background shadow-sm border border-border/50">
                      <Globe
                        className="h-5 w-5"
                        style={{ color: BRAND_PURPLE }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold group-hover:text-primary transition-colors">
                        Visit Official Website
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {uni.website.replace(/https?:\/\//, "")}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Scholarship Row (for university detail)
// ═══════════════════════════════════════════

function ScholarshipRow({
  scholarship,
  onClick,
}: {
  scholarship: IPublicScholarship;
  onClick: () => void;
}) {
  const { format } = require("date-fns");
  const deadlineDate = new Date(scholarship.deadline);
  const isExpired = deadlineDate < new Date();

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30 hover:bg-muted/10"
    >
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-foreground truncate">
          {scholarship.title}
        </p>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span className="font-semibold">
            ৳{scholarship.amountPerStudent.toLocaleString()}
          </span>
          <span>·</span>
          <span>{scholarship.quota} seats</span>
          <span>·</span>
          <span
            className={isExpired ? "text-destructive font-semibold" : ""}
          >
            {format(deadlineDate, "MMM dd, yyyy")}
          </span>
        </div>
        {scholarship.department && (
          <Badge
            variant="outline"
            className="text-[10px] font-bold mt-1.5 rounded-lg"
          >
            {scholarship.department.name}
          </Badge>
        )}
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </button>
  );
}

// ─── Sidebar Stat ───

function SidebarStat({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
        style={{ backgroundColor: `${color}12` }}
      >
        <div style={{ color }}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-semibold">
          {label}
        </p>
        <p className="text-sm font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

// ─── Skeleton ───

function DetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-6">
      <Skeleton className="h-9 w-48" />
      <Card className="rounded-2xl">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-center gap-6">
            <Skeleton className="h-28 w-28 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="rounded-2xl">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}