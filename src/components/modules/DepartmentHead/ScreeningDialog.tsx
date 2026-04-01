/* eslint-disable @typescript-eslint/no-explicit-any */
// components/modules/DepartmentHead/Screening/ScreeningDialog.tsx

"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  User,
  GraduationCap,
  Calendar,
  Loader2,
  AlertTriangle,
  ClipboardCheck,
  FileText,
  DollarSign,
  Mail,
  ExternalLink,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { getApplicationById } from "@/services/application.services";
import type { IScreeningApplication } from "@/types/screening";

// Ensure this matches your actual import path
import type { IApplicationDetails } from "@/types/application"; 

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { screenApplicationAction } from "@/app/(dashboardLayout)/(departmentHeadRoutes)/department-head/screening/_actions";

interface Props {
  open: boolean;
  onClose: () => void;
  application: IScreeningApplication | null;
  onSuccess: () => void;
}

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

export default function ScreeningDialog({
  open,
  onClose,
  application,
  onSuccess,
}: Props) {
  const [decision, setDecision] = useState<"pass" | "reject" | null>(null);
  const [comment, setComment] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  // ── Fetch full application details ──
  const { data: fullResponse, isLoading: isDetailLoading } = useQuery({
    queryKey: ["application-detail", application?.id],
    queryFn: () => getApplicationById(application?.id as string),
    enabled: !!application?.id && open,
  });

  // Cast the response to your exact interface to eliminate TS errors
  const fullApp = fullResponse?.data as IApplicationDetails | undefined;

  // Safely cast financialInfo to access its dynamic keys
  const financialData = fullApp?.financialInfo as Record<string, string | number> | null;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: { passed: boolean; comment?: string }) =>
      screenApplicationAction(application?.id || "", payload),
  });

  const handleSubmit = async () => {
    if (!decision) {
      setServerError("Please select Pass or Reject");
      return;
    }

    if (decision === "reject" && !comment.trim()) {
      setServerError("Please provide a reason for rejection");
      return;
    }

    setServerError(null);

    const payload = {
      passed: decision === "pass",
      ...(comment.trim() && { comment: comment.trim() }),
    };

    try {
      const result = await mutateAsync(payload);

      if (result.success) {
        toast.success(result.message || "Application screened successfully");
        resetState();
        onSuccess();
      } else {
        setServerError(result.message || "Failed to process application");
      }
    } catch (error: unknown) {
      setServerError(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  const resetState = () => {
    setDecision(null);
    setComment("");
    setServerError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-black">
            <ClipboardCheck
              className="h-5 w-5"
              style={{ color: BRAND_PURPLE }}
            />
            Screen Application
          </DialogTitle>
          <DialogDescription>
            Review the application details and make your screening decision.
          </DialogDescription>
        </DialogHeader>

        {/* ═══════════════════════════════════════════ */}
        {/* Application Details Section                */}
        {/* ═══════════════════════════════════════════ */}

        {isDetailLoading ? (
          <DetailSkeleton />
        ) : fullApp ? (
          <div className="space-y-4">
            
            {/* ── AI Screening Insights ── */}
            {(fullApp.aiScore !== null || fullApp.aiSummary || fullApp.aiEligible !== null) && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary mb-3">
                  <Sparkles className="h-4 w-4" />
                  AI Screening Insights
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  {fullApp.aiScore !== null && (
                    <DetailField label="AI Match Score" value={`${fullApp.aiScore}/100`} />
                  )}
                  {fullApp.aiEligible !== null && (
                    <DetailField 
                      label="Eligibility Prediction" 
                      value={fullApp.aiEligible ? "Meets Criteria" : "Does Not Meet Criteria"} 
                    />
                  )}
                </div>
                {fullApp.aiSummary && (
                  <div className="text-sm text-foreground/90 bg-background/50 p-3 rounded-lg border border-primary/10 leading-relaxed">
                    {fullApp.aiSummary}
                  </div>
                )}
              </div>
            )}

            {/* ── Student Info ── */}
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                <User className="h-3.5 w-3.5" />
                Student Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow
                  icon={User}
                  label="Name"
                  value={(fullApp.student as any)?.user?.name || application.student?.user?.name || "—"}
                />
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={(fullApp.student as any)?.user?.email || application.student?.user?.email || "—"}
                />
              </div>
            </div>

            {/* ── Scholarship Info ── */}
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                <GraduationCap className="h-3.5 w-3.5" />
                Scholarship
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow
                  icon={GraduationCap}
                  label="Title"
                  value={(fullApp.scholarship as any)?.title || application.scholarship?.title || "—"}
                />
                <InfoRow
                  icon={Calendar}
                  label="Applied"
                  value={
                    fullApp.createdAt
                      ? new Date(fullApp.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"
                  }
                />
              </div>
            </div>

            {/* ── Essay ── */}
            {fullApp.essay && (
              <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  <FileText className="h-3.5 w-3.5" />
                  Essay / Statement
                </h4>
                <div className="text-sm text-foreground/90 whitespace-pre-wrap rounded-lg bg-background p-3 border border-border/30 max-h-48 overflow-y-auto">
                  {fullApp.essay}
                </div>
              </div>
            )}

            {/* ── Financial Info ── */}
            {financialData && Object.keys(financialData).length > 0 && (
              <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  <DollarSign className="h-3.5 w-3.5" />
                  Financial Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {financialData.familyIncome && (
                    <DetailField
                      label="Family Income"
                      value={financialData.familyIncome}
                    />
                  )}
                  {financialData.financialNeed && (
                    <DetailField
                      label="Financial Need"
                      value={financialData.financialNeed}
                    />
                  )}
                </div>
              </div>
            )}

            {/* ── Documents ── */}
            {fullApp.documents && fullApp.documents.length > 0 && (
              <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  <FileText className="h-3.5 w-3.5" />
                  Documents
                </h4>
                <div className="space-y-2">
                  {fullApp.documents.map(
                    (doc: any, idx: number) => (
                      <a
                        key={idx}
                        href={doc.url || doc.fileUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-lg border border-border/40 bg-background p-2.5 hover:bg-muted/30 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm font-semibold text-foreground flex-1 truncate">
                          {doc.name || doc.title || `Document ${idx + 1}`}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      </a>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Fallback if fullApp fails to load */
          <div className="rounded-xl border border-border/40 bg-muted/10 p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#4b2875] to-[#0097b2]">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-bold text-foreground">
                  {application.student?.user?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {application.student?.user?.email}
                </p>
              </div>
            </div>
            <Separator />
            <Badge variant="secondary" className="gap-1 font-semibold text-xs">
              <GraduationCap className="h-3 w-3" />
              {application.scholarship?.title}
            </Badge>
          </div>
        )}

        <Separator />

        {/* ═══════════════════════════════════════════ */}
        {/* Decision Section                           */}
        {/* ═══════════════════════════════════════════ */}

        <div className="space-y-3">
          <Label className="font-bold text-foreground">
            Screening Decision <span className="text-red-500">*</span>
          </Label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setDecision("pass");
                setServerError(null);
              }}
              disabled={isPending}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                decision === "pass"
                  ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                  : "border-border/40 bg-background hover:border-emerald-300 hover:bg-emerald-50/50"
              }`}
            >
              <CheckCircle2
                className={`h-8 w-8 ${
                  decision === "pass"
                    ? "text-emerald-600"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-bold ${
                  decision === "pass"
                    ? "text-emerald-700"
                    : "text-muted-foreground"
                }`}
              >
                Pass
              </span>
              <span className="text-[10px] text-muted-foreground text-center">
                Move to Committee Review
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setDecision("reject");
                setServerError(null);
              }}
              disabled={isPending}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                decision === "reject"
                  ? "border-red-500 bg-red-500/10 shadow-sm"
                  : "border-border/40 bg-background hover:border-red-300 hover:bg-red-50/50"
              }`}
            >
              <XCircle
                className={`h-8 w-8 ${
                  decision === "reject"
                    ? "text-red-600"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-bold ${
                  decision === "reject"
                    ? "text-red-700"
                    : "text-muted-foreground"
                }`}
              >
                Reject
              </span>
              <span className="text-[10px] text-muted-foreground text-center">
                Reject Application
              </span>
            </button>
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <Label className="font-bold text-foreground">
            Comment{" "}
            {decision === "reject" && (
              <span className="text-red-500">* (required for rejection)</span>
            )}
          </Label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              decision === "reject"
                ? "Provide a reason for rejection..."
                : "Add an optional comment..."
            }
            className="min-h-[100px] rounded-xl bg-muted/30 resize-none"
            maxLength={5000}
            disabled={isPending}
          />
          <p className="text-xs text-muted-foreground text-right">
            {comment.length}/5000
          </p>
        </div>

        {/* Warnings & Errors */}
        <AnimatePresence mode="wait">
          {decision && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Alert
                className="rounded-xl mt-2"
                variant={decision === "reject" ? "destructive" : "default"}
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs font-medium">
                  {decision === "pass"
                    ? "This application will be moved to Committee Review. This action cannot be undone."
                    : "This application will be permanently rejected. This action cannot be undone."}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {serverError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Alert variant="destructive" className="rounded-xl mt-2">
                <AlertDescription className="font-medium text-xs">
                  {serverError}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="pt-4 mt-2 border-t border-border/40 flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isPending}
            className="rounded-xl font-bold h-10 px-6"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isPending || !decision}
            className="rounded-xl px-6 h-10 font-black text-white shadow-md transition-all hover:shadow-lg"
            style={{
              background:
                decision === "reject"
                  ? "linear-gradient(135deg, #dc2626, #ef4444)"
                  : `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
            }}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : decision === "pass" ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm Pass
              </>
            ) : decision === "reject" ? (
              <>
                <XCircle className="h-4 w-4 mr-2" />
                Confirm Reject
              </>
            ) : (
              "Select Decision"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════
// Sub-Components
// ═══════════════════════════════════════════

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | number | null; 
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/30 bg-background p-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted/50">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground truncate">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function DetailField({ 
  label, 
  value 
}: { 
  label: string; 
  value?: string | number | null; 
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-semibold text-foreground leading-tight">
        {value || "—"}
      </p>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-24 rounded-xl w-full" />
      <Skeleton className="h-20 rounded-xl w-full" />
      <Skeleton className="h-16 rounded-xl w-full" />
      <Skeleton className="h-32 rounded-xl w-full" />
    </div>
  );
}