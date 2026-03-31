// src/components/modules/Dashboard/Scholarships/ChangeStatusModal.tsx

"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { RefreshCw, ArrowDown, AlertCircle } from "lucide-react";

import { changeScholarshipStatusAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/scholarships-management/_actions";
import type { IScholarship, ScholarshipStatus } from "@/types/scholarship";
import {
  SCHOLARSHIP_STATUS_LABELS,
  SCHOLARSHIP_STATUS_VARIANT,
  VALID_SCHOLARSHIP_STATUS_TRANSITIONS,
} from "@/types/scholarship";

import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scholarship: IScholarship | null;
  onSuccess: () => void;
}

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

export default function ChangeStatusModal({
  open,
  onOpenChange,
  scholarship,
  onSuccess,
}: Props) {
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: { status: string }) =>
      changeScholarshipStatusAction(scholarship!.id, payload),
  });

  const form = useForm({
    defaultValues: {
      status: "" as ScholarshipStatus,
    },
    onSubmit: async ({ value }) => {
      if (!scholarship) return;
      setServerError(null);
      const toastId = toast.loading("Updating status...");

      try {
        const result = await mutateAsync(value);
        if (result.success) {
          toast.success(result.message || "Status updated successfully", {
            id: toastId,
          });
          onOpenChange(false);
          onSuccess();
        } else {
          setServerError(result.message || "Something went wrong");
          toast.error(result.message || "Something went wrong", {
            id: toastId,
          });
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Something went wrong";
        setServerError(message);
        toast.error(message, { id: toastId });
      }
    },
  });

  useEffect(() => {
    if (scholarship) form.reset();
    setServerError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scholarship]);

  if (!scholarship) return null;

  const validTargets =
    VALID_SCHOLARSHIP_STATUS_TRANSITIONS[scholarship.status] || [];

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      form.reset();
      setServerError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-125 p-0 overflow-hidden rounded-[2rem] border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Change Status for {scholarship.title}</DialogTitle>
        </VisuallyHidden>

        {/* ─── Premium Custom Header ─── */}
        <div className="px-6 pt-8 pb-4 sm:px-8 border-b border-border/40 bg-muted/10">
          <div className="flex items-start gap-4">
            <div 
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-inner border border-primary/20"
              style={{ background: `linear-gradient(135deg, ${BRAND_PURPLE}15, ${BRAND_TEAL}15)` }}
            >
              <RefreshCw className="h-6 w-6 text-primary" style={{ color: BRAND_TEAL }} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                Update Scholarship Status
              </h2>
              <p className="mt-1 text-sm font-medium text-muted-foreground leading-relaxed">
                Modifying program state for <span className="font-bold text-foreground">{scholarship.title}</span>.
              </p>
            </div>
          </div>
        </div>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col"
        >
          {/* ─── Modal Body ─── */}
          <div className="px-6 py-8 sm:px-8 bg-card">
            
            {/* Current Status Box */}
            <div className="relative flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-muted/20 p-5 shadow-sm">
              <span className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Current State
              </span>
              <Badge variant={SCHOLARSHIP_STATUS_VARIANT[scholarship.status]} className="px-4 py-1.5 text-sm shadow-sm">
                {SCHOLARSHIP_STATUS_LABELS[scholarship.status] || scholarship.status}
              </Badge>
            </div>

            {/* No Transitions Available (Terminal State) */}
            {validTargets.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
                <AlertCircle className="mb-3 h-8 w-8 text-rose-500" />
                <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
                  This program has reached a terminal state. Its status cannot be changed from <strong className="font-bold">{SCHOLARSHIP_STATUS_LABELS[scholarship.status]}</strong>.
                </p>
              </div>
            ) : (
              <>
                {/* Visual Connector Arrow */}
                <div className="flex justify-center py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/50 bg-background shadow-sm text-muted-foreground">
                    <ArrowDown className="h-4 w-4" />
                  </div>
                </div>

                {/* New Status Box */}
                <div className="rounded-2xl border border-border/50 bg-muted/20 p-5 shadow-sm">
                  <form.Field name="status">
                    {(field) => (
                      <div className="flex flex-col items-center text-center">
                        <label className="mb-3 text-xs font-bold uppercase tracking-widest text-foreground">
                          Select New State
                        </label>
                        <Select
                          value={field.state.value}
                          onValueChange={(v) => field.handleChange(v as ScholarshipStatus)}
                        >
                          <SelectTrigger className="h-12 w-full max-w-70 rounded-xl border-border/60 bg-background shadow-sm transition-colors focus:ring-primary/50">
                            <SelectValue placeholder="Choose new status..." />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {validTargets.map((s) => (
                              <SelectItem key={s} value={s} className="rounded-lg font-medium">
                                {SCHOLARSHIP_STATUS_LABELS[s] || s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {/* Error Message */}
                        {field.state.meta.errors?.length > 0 && (
                          <p className="mt-2.5 text-xs font-semibold text-destructive">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>

                {/* Server Error Alert */}
                <AnimatePresence mode="wait">
                  {serverError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="mt-6"
                    >
                      <Alert variant="destructive" className="border-rose-500/30 bg-rose-500/10 text-rose-600 rounded-xl">
                        <AlertDescription className="font-semibold text-sm">
                          {serverError}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          {/* ─── Premium Footer ─── */}
          {validTargets.length > 0 && (
            <div className="border-t border-border/40 bg-muted/10 px-6 py-5 sm:px-8 flex items-center justify-end">
              <form.Subscribe
                selector={(s) => [s.canSubmit, s.isSubmitting] as const}
              >
                {([canSubmit, isSubmitting]) => (
                  <AppSubmitButton
                    isPending={isSubmitting || isPending}
                    pendingLabel="Applying Change..."
                    disabled={!canSubmit}
                    className="h-11 px-8 rounded-xl font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
                    }}
                  >
                    Confirm Status Change
                  </AppSubmitButton>
                )}
              </form.Subscribe>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}