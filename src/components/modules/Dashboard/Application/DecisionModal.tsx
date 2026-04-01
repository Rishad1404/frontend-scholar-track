// src/components/modules/Dashboard/Applications/DecisionModal.tsx

"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Bot, ClipboardList } from "lucide-react";

import { makeDecisionAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/applications-management/_actions";
import { makeDecisionSchema } from "@/zod/application.validation";
import type { IApplication } from "@/types/application";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_VARIANT,
} from "@/types/application";

import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: IApplication | null;
  onSuccess: () => void;
}

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

export default function DecisionModal({
  open,
  onOpenChange,
  application,
  onSuccess,
}: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const qc = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: { decision: "APPROVED" | "REJECTED"; remarks?: string }) =>
      makeDecisionAction(application!.id, payload),
  });

  const form = useForm({
    // 🚨 No adapter needed here anymore!
    defaultValues: {
      decision: "" as "APPROVED" | "REJECTED" | "",
      remarks: "",
    },
    onSubmit: async ({ value }) => {
      if (!application || !value.decision) return;
      setServerError(null);

      const isApproving = value.decision === "APPROVED";
      const toastId = toast.loading(
        isApproving ? "Approving application..." : "Rejecting application...",
      );

      try {
        const result = await mutateAsync({
          decision: value.decision as "APPROVED" | "REJECTED",
          remarks: value.remarks?.trim() || undefined,
        });

        if (result.success) {
          toast.success(result.message, { id: toastId });
          qc.invalidateQueries({ queryKey: ["applications"] });
          qc.invalidateQueries({
            queryKey: ["application-detail", application.id],
          });
          onOpenChange(false);
          form.reset();
          onSuccess();
        } else {
          setServerError(result.message || "Something went wrong");
          toast.error(result.message || "Something went wrong", {
            id: toastId,
          });
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Something went wrong";
        setServerError(message);
        toast.error(message, { id: toastId });
      }
    },
  });

  if (!application) return null;

  const canDecide = application.status === "UNDER_REVIEW";
  const selectedDecision = form.state.values.decision;

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      form.reset();
      setServerError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-137.5 max-h-[90vh] overflow-hidden rounded-[2rem] border-border/50 bg-background/95 p-0 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="border-b border-border/40 bg-muted/10 px-6 pt-8 pb-6 sm:px-8">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-2xl font-extrabold tracking-tight text-foreground">
              Make Decision
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-base font-medium text-muted-foreground">
              Final decision for{" "}
              <span className="font-semibold text-foreground">
                {application.student.user.name}
              </span>
              &apos;s application to{" "}
              <span className="font-semibold text-foreground">
                {application.scholarship.title}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
        </div>

        {!canDecide ? (
          <div className="px-6 py-8 text-center text-muted-foreground sm:px-8">
            <p>
              Only <strong className="text-foreground">Under Review</strong> applications
              can receive a final decision. Current status:{" "}
              <Badge variant={APPLICATION_STATUS_VARIANT[application.status]}>
                {APPLICATION_STATUS_LABELS[application.status]}
              </Badge>
            </p>
          </div>
        ) : (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex flex-col"
          >
            {/* Scrollable body */}
            <div className="max-h-[55vh] space-y-6 overflow-y-auto custom-scrollbar px-6 py-6 sm:px-8">
              {/* Current status */}
              <div className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/10 p-4 shadow-sm">
                <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Current Status
                </span>
                <Badge variant={APPLICATION_STATUS_VARIANT[application.status]}>
                  {APPLICATION_STATUS_LABELS[application.status]}
                </Badge>
              </div>

              {/* Application summary */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Application Summary
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center justify-between rounded-xl border border-border/40 bg-card p-3.5 shadow-sm transition-colors hover:bg-muted/10">
                    <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Bot className="h-4 w-4" /> AI Score
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {application.aiScore !== null && application.aiScore !== undefined
                        ? `${application.aiScore.toFixed(0)}/100 ${application.aiEligible ? "✅" : "❌"}`
                        : "Not evaluated"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border/40 bg-card p-3.5 shadow-sm transition-colors hover:bg-muted/10">
                    <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <ClipboardList className="h-4 w-4" /> Amount
                    </span>
                    <span className="text-sm font-bold text-emerald-500">
                      ৳{application.scholarship.amountPerStudent.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/60" />

              {/* Decision selection */}
              <form.Field
                name="decision"
                validators={{
                  // 🚨 Native Zod parsing without the adapter!
                  onChange: ({ value }) => {
                    const res = makeDecisionSchema.shape.decision.safeParse(value);
                    return res.success ? undefined : res.error.issues[0].message;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-3">
                    <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      Record Decision
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Approve */}
                      <button
                        type="button"
                        onClick={() => field.handleChange("APPROVED")}
                        className={`group flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-5 transition-all cursor-pointer ${
                          field.state.value === "APPROVED"
                            ? "border-emerald-500 bg-emerald-500/10 shadow-md"
                            : "border-border/60 bg-card hover:border-emerald-500/50 hover:bg-emerald-500/5"
                        }`}
                      >
                        <CheckCircle2
                          className={`h-8 w-8 transition-colors ${
                            field.state.value === "APPROVED"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-muted-foreground group-hover:text-emerald-500/50"
                          }`}
                        />
                        <span
                          className={`text-sm font-extrabold ${
                            field.state.value === "APPROVED"
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-foreground"
                          }`}
                        >
                          Approve
                        </span>
                        <span className="text-xs text-muted-foreground mt-1 hidden sm:block">
                          Eligible for funds
                        </span>
                      </button>

                      {/* Reject */}
                      <button
                        type="button"
                        onClick={() => field.handleChange("REJECTED")}
                        className={`group flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-5 transition-all cursor-pointer ${
                          field.state.value === "REJECTED"
                            ? "border-rose-500 bg-rose-500/10 shadow-md"
                            : "border-border/60 bg-card hover:border-rose-500/50 hover:bg-rose-500/5"
                        }`}
                      >
                        <XCircle
                          className={`h-8 w-8 transition-colors ${
                            field.state.value === "REJECTED"
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-muted-foreground group-hover:text-rose-500/50"
                          }`}
                        />
                        <span
                          className={`text-sm font-extrabold ${
                            field.state.value === "REJECTED"
                              ? "text-rose-700 dark:text-rose-400"
                              : "text-foreground"
                          }`}
                        >
                          Reject
                        </span>
                        <span className="text-xs text-muted-foreground mt-1 hidden sm:block">
                          Decline application
                        </span>
                      </button>
                    </div>
                    {/* Native errors array handling */}
                    {field.state.meta.errors?.length > 0 && (
                      <p className="text-sm font-medium text-destructive mt-2">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Remarks */}
              <form.Field
                name="remarks"
                validators={{
                  // 🚨 Native Zod parsing without the adapter!
                  onChange: ({ value }) => {
                    const res = makeDecisionSchema.shape.remarks.safeParse(value);
                    return res.success ? undefined : res.error.issues[0].message;
                  },
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label className="font-semibold text-foreground">
                      Remarks{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </Label>
                    <Textarea
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder={
                        selectedDecision === "REJECTED"
                          ? "Please provide a reason for rejection..."
                          : "Add any notes about this decision..."
                      }
                      rows={3}
                      className="rounded-xl resize-none bg-background border-border/60"
                    />
                    {field.state.meta.errors?.length > 0 && (
                      <p className="text-sm font-medium text-destructive mt-1">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* Warnings & Server Errors */}
              <AnimatePresence mode="wait">
                {selectedDecision === "REJECTED" && (
                  <motion.div
                    key="reject-alert" // 🚨 Added unique key
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Alert className="border-rose-500/30 bg-rose-500/10 text-rose-600 rounded-xl mt-4">
                      <AlertDescription className="font-semibold text-sm">
                        This action will permanently reject the application. The student
                        will be notified.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {selectedDecision === "APPROVED" && (
                  <motion.div
                    key="approve-alert" // 🚨 Added unique key
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 rounded-xl mt-4">
                      <AlertDescription className="font-semibold text-sm">
                        The student will be notified and become eligible for disbursement
                        (৳{application.scholarship.amountPerStudent.toLocaleString()}).
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {serverError && (
                  <motion.div
                    key="server-error" // 🚨 Added unique key
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Alert
                      variant="destructive"
                      className="border-rose-500/30 bg-rose-500/10 text-rose-600 rounded-xl mt-4"
                    >
                      <AlertDescription className="font-semibold text-sm">
                        {serverError}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <DialogFooter className="flex items-center justify-end border-t border-border/40 bg-muted/10 px-6 py-5 sm:px-8">
              <form.Subscribe selector={(s) => [s.values, s.isSubmitting] as const}>
                {([values, isSubmitting]) => {
                  // 🚨 DIRECT CHECK: Is a decision actually selected in the form state?
                  const hasDecision =
                    values.decision === "APPROVED" || values.decision === "REJECTED";

                  // 🚨 MANUAL LOCK: Only disable if we are currently loading or if NO decision is made.
                  const isButtonDisabled = isSubmitting || isPending || !hasDecision;

                  return (
                    <AppSubmitButton
                      // Use our simplified loading state
                      isPending={isSubmitting || isPending}
                      pendingLabel={
                        values.decision === "APPROVED" ? "Approving..." : "Rejecting..."
                      }
                      // Force it to be clickable if hasDecision is true
                      disabled={isButtonDisabled}
                      className="h-12 rounded-xl px-8 font-black text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
                      style={{
                        background:
                          values.decision === "REJECTED"
                            ? "linear-gradient(135deg, #dc2626, #ef4444)"
                            : `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
                      }}
                    >
                      {values.decision === "APPROVED"
                        ? "Approve Application"
                        : values.decision === "REJECTED"
                          ? "Reject Application"
                          : "Make Decision"}
                    </AppSubmitButton>
                  );
                }}
              </form.Subscribe>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
