/* eslint-disable react-hooks/purity */
// src/app/(commonLayout)/scholarships/[id]/_components/ScholarshipDetail.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { format, formatDistanceToNow, isPast } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Download,
  FileCheck2,
  Globe,
  GraduationCap,
  Target,
  Users,
  AlertCircle,
  CheckCircle2,
  Info,
  Wallet,
  BookOpen,
  LogIn,
} from "lucide-react";

import { getPublicScholarshipById } from "@/services/publicScholarship.services";
import { DOCUMENT_TYPE_LABELS } from "@/types/publicScholarship";

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
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

interface Props {
  scholarshipId: string;
}

export default function ScholarshipDetail({ scholarshipId }: Props) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-scholarship", scholarshipId],
    queryFn: () => getPublicScholarshipById(scholarshipId),
  });

  if (isLoading) return <DetailSkeleton />;

  if (isError || !data?.data) {
    return (
      <div className="container mx-auto px-4 py-12 space-y-4">
        <Button variant="ghost" asChild className="font-bold">
          <Link href="/scholarships">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Scholarships
          </Link>
        </Button>
        <Card className="rounded-2xl">
          <CardContent className="pt-16 pb-16 text-center">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/30" />
            <h2 className="mt-6 text-2xl font-bold">
              Scholarship Not Found
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              This scholarship may have been removed or is no longer
              accepting applications.
            </p>
            <Button
              asChild
              className="mt-6 rounded-xl font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
              }}
            >
              <Link href="/scholarships">Browse All Scholarships</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const scholarship = data.data;
  const deadlineDate = new Date(scholarship.deadline);
  const isExpired = isPast(deadlineDate);
  const daysLeft = Math.ceil(
    (deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const isUrgent = !isExpired && daysLeft <= 7;

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {/* Back Button */}
      <Button
        variant="ghost"
        asChild
        className="font-bold mb-6"
      >
        <Link href="/scholarships">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Scholarships
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ─── Main Content (Left 2 cols) ─── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card className="rounded-2xl overflow-hidden">
            <div
              className="h-2"
              style={{
                background: isExpired
                  ? "#dc2626"
                  : `linear-gradient(90deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
              }}
            />
            <CardContent className="pt-6">
              {/* University */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/50 border border-border/40 overflow-hidden">
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
                <div>
                  <p className="font-bold text-sm">
                    {scholarship.university.name}
                  </p>
                  {scholarship.university.website && (
                    <a
                      href={scholarship.university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary hover:underline flex items-center gap-1 transition-colors"
                    >
                      <Globe className="h-3 w-3" />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {scholarship.title}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {scholarship.department && (
                  <Badge variant="outline" className="font-bold rounded-lg">
                    {scholarship.department.name}
                  </Badge>
                )}
                {scholarship.level && (
                  <Badge variant="outline" className="font-bold rounded-lg">
                    {scholarship.level.name}
                  </Badge>
                )}
                {scholarship.financialNeedRequired && (
                  <Badge className="font-bold rounded-lg border-amber-500/30 bg-amber-500/10 text-amber-600">
                    Financial Need Required
                  </Badge>
                )}
                {isExpired && (
                  <Badge variant="destructive" className="font-bold rounded-lg">
                    Deadline Passed
                  </Badge>
                )}
              </div>

              {/* Urgency Alert */}
              {isUrgent && (
                <Alert className="mt-4 border-amber-500/30 bg-amber-500/5 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-700 dark:text-amber-400 font-bold">
                    Closing Soon!
                  </AlertTitle>
                  <AlertDescription className="text-amber-600 dark:text-amber-300 font-medium">
                    Only {daysLeft} day{daysLeft !== 1 ? "s" : ""} left to
                    apply.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          {scholarship.description && (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  About This Scholarship
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {scholarship.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Eligibility */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Target className="h-5 w-5 text-muted-foreground" />
                Eligibility Criteria
              </CardTitle>
              <CardDescription>
                Requirements to apply for this scholarship
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {scholarship.minCgpa && (
                <CriteriaRow
                  icon={GraduationCap}
                  label="Minimum CGPA"
                  value={scholarship.minCgpa.toFixed(2)}
                />
              )}
              {scholarship.minGpa && (
                <CriteriaRow
                  icon={GraduationCap}
                  label="Minimum GPA"
                  value={scholarship.minGpa.toFixed(2)}
                />
              )}
              {scholarship.department && (
                <CriteriaRow
                  icon={Building2}
                  label="Department"
                  value={scholarship.department.name}
                />
              )}
              {scholarship.level && (
                <CriteriaRow
                  icon={GraduationCap}
                  label="Academic Level"
                  value={scholarship.level.name}
                />
              )}
              {scholarship.financialNeedRequired && (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <Info className="h-4 w-4 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Financial Need Verification
                    </p>
                    <p className="text-xs text-muted-foreground">
                      You must provide proof of financial need in your
                      application.
                    </p>
                  </div>
                </div>
              )}
              {!scholarship.minCgpa &&
                !scholarship.minGpa &&
                !scholarship.department &&
                !scholarship.level &&
                !scholarship.financialNeedRequired && (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-green-500/5 border border-green-500/20">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      Open to all eligible students — no specific
                      criteria required.
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Required Documents */}
          {scholarship.requiredDocTypes.length > 0 && (
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-muted-foreground" />
                  Required Documents
                </CardTitle>
                <CardDescription>
                  Documents you must submit with your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  {scholarship.requiredDocTypes.map((docType) => (
                    <div
                      key={docType}
                      className="flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3.5 shadow-sm"
                    >
                      <FileCheck2
                        className="h-4 w-4 shrink-0"
                        style={{ color: BRAND_TEAL }}
                      />
                      <span className="text-sm font-bold text-foreground">
                        {DOCUMENT_TYPE_LABELS[docType] ??
                          docType.replace(/_/g, " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Guidelines Document */}
          {scholarship.document && (
            <Card className="rounded-2xl">
              <CardContent className="pt-6">
                <a
                  href={scholarship.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all hover:bg-primary/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background shadow-sm border border-border/50">
                      <Download
                        className="h-5 w-5"
                        style={{ color: BRAND_PURPLE }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold group-hover:text-primary transition-colors">
                        Official Guidelines Document
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Download the full scholarship guidelines
                      </p>
                    </div>
                  </div>
                  <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ─── Sidebar (Right) ─── */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card className="rounded-2xl sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Scholarship Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SidebarItem
                icon={DollarSign}
                label="Amount per Student"
                value={`৳${scholarship.amountPerStudent.toLocaleString()}`}
                color={BRAND_TEAL}
              />
              <SidebarItem
                icon={Wallet}
                label="Total Fund"
                value={`৳${scholarship.totalAmount.toLocaleString()}`}
                color="#16a34a"
              />

              <Separator />

              <SidebarItem
                icon={Users}
                label="Available Seats"
                value={`${scholarship.quota} students`}
                color={BRAND_PURPLE}
              />

              <Separator />

              <SidebarItem
                icon={Calendar}
                label="Deadline"
                value={format(deadlineDate, "MMMM dd, yyyy")}
                color={isExpired ? "#dc2626" : "#6b7280"}
              />
              <SidebarItem
                icon={Clock}
                label="Time Remaining"
                value={
                  isExpired
                    ? "Expired"
                    : formatDistanceToNow(deadlineDate, {
                        addSuffix: true,
                      })
                }
                color={isExpired ? "#dc2626" : "#f59e0b"}
              />

              {scholarship.level && (
                <>
                  <Separator />
                  <SidebarItem
                    icon={GraduationCap}
                    label="Academic Level"
                    value={scholarship.level.name}
                    color="#8b5cf6"
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* CTA Card */}
          {!isExpired && (
            <Card
              className="rounded-2xl border-primary/30 overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${BRAND_PURPLE}08, ${BRAND_TEAL}08)` }}
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
                    Ready to Apply?
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sign in to your student account to submit your
                    application.
                  </p>
                </div>
                <Button
                  asChild
                  className="w-full h-12 rounded-xl font-black text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
                  }}
                >
                  <Link href="/auth/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In to Apply
                  </Link>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="font-bold text-primary hover:underline"
                  >
                    Register here
                  </Link>
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Micro-components ───

function CriteriaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-3.5 shadow-sm transition-colors hover:bg-muted/10">
      <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Icon className="h-4 w-4 opacity-70" /> {label}
      </span>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
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
        <p className="text-sm font-bold text-foreground truncate">
          {value}
        </p>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-6">
      <Skeleton className="h-9 w-48" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-5 w-40" />
              </div>
              <Skeleton className="h-10 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-lg" />
                <Skeleton className="h-6 w-24 rounded-lg" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="rounded-2xl">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}