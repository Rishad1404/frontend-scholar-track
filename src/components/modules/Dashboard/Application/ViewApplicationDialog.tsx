/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/modules/Dashboard/Applications/ViewApplicationDialog.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ListChecks,
  User,
  GraduationCap,
  Calendar,
  FileText,
  ScrollText,
  Bot,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  Gavel,
  Hash,
  Target,
  FileCheck2,
  CreditCard,
  Star,
  Send,
} from "lucide-react";
import type { IApplication, IApplicationDetails } from "@/types/application";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_VARIANT,
} from "@/types/application";
import { DOCUMENT_TYPE_LABELS } from "@/types/scholarship";
import { ACADEMIC_STATUS_LABELS, ACADEMIC_STATUS_VARIANT } from "@/types/student";
import { getApplicationById } from "@/services/application.services";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: IApplication | null;
  onAiEvaluate?: (application: IApplication) => void;
  onMakeDecision?: (application: IApplication) => void;
  onEvaluate?: (application: IApplication) => void;
  onCreateDisbursement?: (application: IApplication) => void;
  onRefresh: () => void;
}

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

// ─── Smart Formatting Helpers ───
const formatJsonKey = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const formatJsonValue = (key: string, value: any): React.ReactNode => {
  if (typeof value === "boolean") {
    return value ? (
      <span className="text-emerald-600 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-md">
        Yes
      </span>
    ) : (
      <span className="text-rose-500 font-bold bg-rose-500/10 px-2.5 py-0.5 rounded-md">
        No
      </span>
    );
  }

  if (typeof value === "number") {
    const lowerKey = key.toLowerCase();
    if (
      lowerKey.includes("amount") ||
      lowerKey.includes("income") ||
      lowerKey.includes("salary")
    ) {
      return (
        <span className="font-black text-emerald-600 dark:text-emerald-400">
          ৳{value.toLocaleString()}
        </span>
      );
    }
    return <span className="font-bold text-foreground">{value.toLocaleString()}</span>;
  }

  return <span className="font-semibold text-foreground">{String(value)}</span>;
};

export default function ViewApplicationDialog({
  open,
  onOpenChange,
  application,
  onAiEvaluate,
  onMakeDecision,
  onEvaluate,
  onCreateDisbursement,
  onRefresh,
}: Props) {
  const { data: res, isLoading } = useQuery({
    queryKey: ["application-detail", application?.id],
    queryFn: () => getApplicationById(application!.id),
    enabled: open && !!application?.id,
  });

  const detail: IApplicationDetails | null = res?.data || null;

  if (!application) return null;

  // ─── Loading Skeleton (Wide Layout) ───
  if (isLoading || !detail) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-225 p-0 rounded-[2rem] border-border/40 overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>Loading Application Details</DialogTitle>
          </VisuallyHidden>

          <div className="border-b border-border/40 bg-muted/10 p-8">
            <Skeleton className="h-8 w-1/3 rounded-xl" />
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
            </div>
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const student = detail.student;
  const scholarship = detail.scholarship;
  const screening = detail.screening;
  const reviews = detail.reviews;
  const documents = detail.documents;
  const hasAi = detail.aiScore !== null;
  const canEvaluateAi = detail.status === "SCREENING" || detail.status === "UNDER_REVIEW";
  const canDecide = detail.status === "UNDER_REVIEW";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-225 p-0 overflow-hidden rounded-[2rem] border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Application Details</DialogTitle>
        </VisuallyHidden>

        {/* ─── Premium Header ─── */}
        <div className="border-b border-border/40 bg-muted/10 px-6 pt-8 pb-6 sm:px-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-inner border border-primary/20 bg-card"
              style={{
                background: `linear-gradient(135deg, ${BRAND_PURPLE}15, ${BRAND_TEAL}15)`,
              }}
            >
              <ListChecks
                className="h-7 w-7 text-primary"
                style={{ color: BRAND_TEAL }}
              />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                Application Review
              </h2>
              <p className="mt-1 text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Hash className="h-3.5 w-3.5" /> {detail.id.slice(0, 8).toUpperCase()}
                <span className="opacity-50 text-[10px]">●</span>
                <Calendar className="h-3.5 w-3.5" />
                {detail.submittedAt
                  ? format(new Date(detail.submittedAt), "MMM dd, yyyy HH:mm")
                  : "Draft Application"}
              </p>
            </div>
          </div>

          <Badge
            variant={APPLICATION_STATUS_VARIANT[detail.status]}
            className="px-4 py-1.5 text-sm font-bold uppercase tracking-wider shadow-sm w-fit"
          >
            {APPLICATION_STATUS_LABELS[detail.status]}
          </Badge>
        </div>

        {/* ─── Scrollable Body ─── */}
        <div className="max-h-[75vh] overflow-y-auto overflow-x-hidden custom-scrollbar px-6 py-8 sm:px-10 space-y-8">
          {/* ── Applicant vs Scholarship Split ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Applicant Profile */}
            <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 border border-border/50">
                  <User className="h-4 w-4 text-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Applicant Profile</h3>
              </div>

              <div className="mb-4">
                <p className="text-xl font-extrabold">{student.user.name}</p>
                <p className="text-sm font-medium text-muted-foreground">
                  {student.user.email}
                </p>
              </div>

              {student.academicInfo ? (
                <div className="space-y-2">
                  <InfoRow
                    label="Department"
                    value={student.academicInfo.department.name}
                  />
                  <InfoRow label="Level" value={student.academicInfo.level.name} />
                  <InfoRow
                    label="GPA / CGPA"
                    value={`${student.academicInfo.gpa.toFixed(2)} / ${student.academicInfo.cgpa.toFixed(2)}`}
                    valueClass="text-primary font-black"
                  />
                  <div className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/10 p-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      Account Status
                    </span>
                    <Badge
                      variant={
                        ACADEMIC_STATUS_VARIANT[student.academicInfo.academicStatus]
                      }
                    >
                      {ACADEMIC_STATUS_LABELS[student.academicInfo.academicStatus]}
                    </Badge>
                  </div>
                  {student.academicInfo.studentIdNo && (
                    <InfoRow
                      label="Student ID"
                      value={student.academicInfo.studentIdNo}
                      valueClass="font-mono"
                    />
                  )}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/10">
                  <p className="text-sm text-muted-foreground italic">
                    No academic profile found.
                  </p>
                </div>
              )}
            </div>

            {/* Scholarship Target */}
            <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 border border-border/50">
                  <GraduationCap className="h-4 w-4 text-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Applied Program</h3>
              </div>

              <div className="mb-4">
                <p className="text-xl font-extrabold truncate" title={scholarship.title}>
                  {scholarship.title}
                </p>
                <p className="text-sm font-medium text-muted-foreground">
                  {scholarship.university.name}
                </p>
              </div>

              <div className="space-y-2">
                <InfoRow
                  label="Award Amount"
                  value={`৳${scholarship.amountPerStudent.toLocaleString()}`}
                  valueClass="text-emerald-500 font-black"
                />
                <InfoRow
                  label="Deadline"
                  value={format(new Date(scholarship.deadline), "MMM dd, yyyy")}
                />

                {(scholarship.minGpa ||
                  scholarship.minCgpa ||
                  scholarship.financialNeedRequired) && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {scholarship.minGpa !== null && scholarship.minGpa > 0 && (
                      <Badge variant="outline">
                        Min GPA: {scholarship.minGpa.toFixed(2)}
                      </Badge>
                    )}
                    {scholarship.minCgpa !== null && scholarship.minCgpa > 0 && (
                      <Badge variant="outline">
                        Min CGPA: {scholarship.minCgpa.toFixed(2)}
                      </Badge>
                    )}
                    {scholarship.financialNeedRequired && (
                      <Badge
                        variant="outline"
                        className="border-amber-500/30 text-amber-600 bg-amber-500/10"
                      >
                        Financial Need Required
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── AI Evaluation Hub ── */}
          {hasAi && (
            <div className="relative overflow-hidden rounded-[1.5rem] border border-blue-500/30 bg-blue-500/5 shadow-inner">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2.5">
                    <Bot className="h-6 w-6 text-blue-500" />
                    AI Screening Report
                  </h3>
                  <Badge
                    variant="outline"
                    className="bg-background/50 backdrop-blur border-blue-500/20 text-blue-600 dark:text-blue-400 px-3 py-1"
                  >
                    Automated Analysis
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center rounded-2xl bg-background border border-border/50 p-4 shadow-sm">
                    <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                      {detail.aiScore?.toFixed(0)}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
                      Overall
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-2xl bg-background border border-border/50 p-4 shadow-sm">
                    <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                      {detail.aiEssayScore?.toFixed(0)}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
                      Essay
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-2xl bg-background border border-border/50 p-4 shadow-sm">
                    <span className="text-3xl font-black">
                      {detail.aiEligible ? "✅" : "❌"}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
                      Eligible
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-sm">
                  {detail.aiEligibleReason && (
                    <div className="bg-background/50 rounded-xl p-5 border border-border/50">
                      <p className="font-bold text-foreground mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-500" /> Eligibility Reasoning
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        {detail.aiEligibleReason}
                      </p>
                    </div>
                  )}
                  {detail.aiSummary && (
                    <div className="bg-background/50 rounded-xl p-5 border border-border/50">
                      <p className="font-bold text-foreground mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-indigo-500" /> Applicant Summary
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        {detail.aiSummary}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Written Submissions ── */}
          <div className="space-y-6">
            {detail.essay && (
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  <ScrollText className="h-4 w-4" /> Personal Essay
                </h4>
                <div className="max-h-60 overflow-y-auto custom-scrollbar rounded-2xl border border-border/50 bg-card p-6 text-sm leading-relaxed text-foreground shadow-sm">
                  {detail.essay}
                </div>
              </div>
            )}

            {detail.financialInfo && Object.keys(detail.financialInfo).length > 0 && (
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  <CreditCard className="h-4 w-4" /> Financial Data
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                  {Object.entries(detail.financialInfo).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-col justify-center rounded-xl border border-border/40 bg-muted/10 p-4 shadow-sm transition-colors hover:bg-muted/20"
                    >
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                        {formatJsonKey(key)}
                      </span>
                      <div className="text-base text-foreground">
                        {formatJsonValue(key, value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Attached Documents ── */}
          {documents.length > 0 && (
            <div className="space-y-4 pt-2">
              <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                <FileCheck2 className="h-4 w-4" /> Attached Documents ({documents.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:border-primary/50 hover:bg-primary/5"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted group-hover:bg-background transition-colors">
                        <FileText className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="text-sm font-bold text-foreground truncate">
                          {doc.fileName}
                        </p>
                        <p className="text-xs font-medium text-muted-foreground mt-0.5">
                          {DOCUMENT_TYPE_LABELS[doc.type]} •{" "}
                          {(doc.fileSize / 1024).toFixed(0)} KB
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ── Human Reviews ── */}
          {(screening || reviews.length > 0) && (
            <div className="space-y-6 pt-4 border-t border-border/50">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2.5">
                <ShieldCheck
                  className="h-5 w-5 text-primary"
                  style={{ color: BRAND_PURPLE }}
                />
                Committee Verdicts
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {screening && (
                  <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                      <h4 className="font-extrabold text-foreground text-base">
                        Initial Screening
                      </h4>
                      <Badge
                        variant={screening.passed ? "default" : "destructive"}
                        className="px-3 py-1"
                      >
                        {screening.passed ? "Passed" : "Failed"}
                      </Badge>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span className="font-medium">Reviewed By</span>
                        <span className="font-bold text-foreground bg-muted/50 px-2 py-1 rounded-md">
                          {screening.departmentHead.user.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span className="font-medium">Date</span>
                        <span className="font-bold text-foreground">
                          {format(new Date(screening.reviewedAt), "MMM dd, yyyy")}
                        </span>
                      </div>
                      {screening.comment && (
                        <div className="pt-4 mt-2 border-t border-border/40">
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                            Screening Notes
                          </span>
                          <p className="font-medium text-foreground italic leading-relaxed">
                            {screening.comment}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <h4 className="font-extrabold text-foreground text-base">
                        {review.reviewer.user.name}
                      </h4>
                      <Badge
                        variant="outline"
                        className="text-primary font-black border-primary/20 bg-primary/5 px-3 py-1 text-sm"
                      >
                        Total Score: {review.totalScore.toFixed(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm mb-5 p-4 rounded-xl bg-muted/10 border border-border/40">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">GPA</span>{" "}
                        <span className="font-bold">{review.gpaScore.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">Essay</span>{" "}
                        <span className="font-bold">{review.essayScore.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">
                          Financial
                        </span>{" "}
                        <span className="font-bold">
                          {review.financialScore.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">
                          Criteria
                        </span>{" "}
                        <span className="font-bold">
                          {review.criteriaScore.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {review.notes && (
                      <div className="pt-1 text-sm">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                          Reviewer Notes
                        </span>
                        <p className="font-medium text-foreground italic leading-relaxed">
                          {review.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── Footer Actions ─── */}
        {(onAiEvaluate || onMakeDecision || onEvaluate || onCreateDisbursement) && (
          <div className="border-t border-border/40 bg-muted/10 px-6 py-5 sm:px-10 flex flex-wrap items-center justify-end gap-4">
            {/* AI Evaluation Button */}
            {onAiEvaluate &&
              canEvaluateAi &&
              (!hasAi ? (
                <Button
                  onClick={() => onAiEvaluate(application)}
                  className="h-11 rounded-xl px-6 font-bold shadow-sm transition-all hover:bg-muted bg-background text-foreground border border-border/60 hover:text-primary"
                >
                  <Sparkles className="mr-2 h-4 w-4" /> Generate AI Evaluation
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => onAiEvaluate(application)}
                  className="h-11 rounded-xl px-6 font-bold shadow-sm transition-all hover:bg-muted/50 border-border/60"
                >
                  <RotateCcw className="mr-2 h-4 w-4 text-muted-foreground" /> Re-run AI
                  Analysis
                </Button>
              ))}

            {/* Make Decision Button */}
            {onMakeDecision && canDecide && (
              <Button
                onClick={() => {
                  onOpenChange(false);
                  onMakeDecision(application);
                }}
                className="h-11 rounded-xl px-8 font-black text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
                }}
              >
                <Gavel className="mr-2 h-4 w-4" /> Make Decision
              </Button>
            )}

            {/* Evaluate Applicant Button (Reviewer Only) */}
            {onEvaluate && detail.status === "UNDER_REVIEW" && (
              <Button
                onClick={() => {
                  onOpenChange(false);
                  onEvaluate(application);
                }}
                className="h-11 rounded-xl px-8 font-black text-white shadow-lg transition-all hover:opacity-90 active:scale-95 bg-amber-500 hover:bg-amber-600"
              >
                <Star className="mr-2 h-4 w-4 fill-white" /> Evaluate Applicant
              </Button>
            )}

            {/* Create Disbursement Button (Admin Only, for APPROVED status) */}
            {onCreateDisbursement && detail.status === "APPROVED" && (
              <Button
                onClick={() => {
                  onOpenChange(false);
                  onCreateDisbursement(application);
                }}
                className="h-11 rounded-xl px-8 font-black text-white shadow-lg transition-all hover:opacity-90 active:scale-95 bg-emerald-600 hover:bg-emerald-700"
              >
                <Send className="mr-2 h-4 w-4" /> Send to Payout Queue
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Reusable Micro-Components ───
function InfoRow({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/10 p-3 shadow-sm transition-colors hover:bg-muted/20">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span
        className={`text-sm font-semibold text-foreground text-right truncate max-w-[60%] ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}
