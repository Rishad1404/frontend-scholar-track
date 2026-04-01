/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { 
  Banknote, 
  PlayCircle, 
  CheckCircle2, 
  XCircle, 
  CreditCard,
  Building 
} from "lucide-react";

import { 
  processDisbursementAction, 
  processViaStripeAction
} from "@/app/(dashboardLayout)/(adminRoutes)/admin/disbursements-management/_actions";
import type { IDisbursement, DisbursementStatus } from "@/types/disbursement";

import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disbursement: IDisbursement | null;
  onSuccess: () => void;
}

export default function ProcessDisbursementModal({ open, onOpenChange, disbursement, onSuccess }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);

  // Mutation for Standard Processing
  const { mutateAsync: processStandard, isPending: isStandardPending } = useMutation({
    mutationFn: (payload: { action: "PROCESS" | "COMPLETE" | "FAIL"; remarks?: string }) =>
      processDisbursementAction(disbursement!.id, payload),
  });

  // Mutation for Stripe Processing
  const { mutateAsync: processStripe, isPending: isStripePending } = useMutation({
    mutationFn: (payload: { stripeAccountId: string }) =>
      processViaStripeAction(disbursement!.id, payload),
  });

  const form = useForm({
    defaultValues: { 
      action: "" as "PROCESS" | "COMPLETE" | "FAIL" | "STRIPE" | "", 
      remarks: "",
      stripeAccountId: "" 
    },
    onSubmit: async ({ value }) => {
      if (!disbursement || !value.action) return;
      setServerError(null);
      const toastId = toast.loading("Processing transaction...");

      let result;

      // ─── Route to the correct server action based on selection ───
      if (value.action === "STRIPE") {
        if (!value.stripeAccountId) {
          setServerError("Stripe Account ID is required for this action.");
          toast.dismiss(toastId);
          return;
        }
        result = await processStripe({ stripeAccountId: value.stripeAccountId });
      } else {
        result = await processStandard({ 
          action: value.action as "PROCESS" | "COMPLETE" | "FAIL", 
          remarks: value.remarks 
        });
      }

      if (result.success) {
        toast.success(result.message, { id: toastId });
        onOpenChange(false);
        form.reset();
        onSuccess();
      } else {
        setServerError(result.message);
        toast.error(result.message, { id: toastId });
      }
    },
  });

  if (!disbursement) return null;

  // ── Calculate Allowed Actions ──
  const validTransitions: Record<DisbursementStatus, Array<{ value: string; label: string; icon: any; color: string }>> = {
    PENDING: [
      { value: "STRIPE", label: "Pay with Stripe", icon: CreditCard, color: "violet" },
      { value: "PROCESS", label: "Manual Transfer", icon: Building, color: "blue" },
    ],
    PROCESSING: [
      { value: "COMPLETE", label: "Mark Completed", icon: CheckCircle2, color: "emerald" },
      { value: "FAIL", label: "Mark Failed", icon: XCircle, color: "rose" },
    ],
    FAILED: [
      { value: "STRIPE", label: "Retry via Stripe", icon: CreditCard, color: "violet" },
      { value: "PROCESS", label: "Retry Manual", icon: PlayCircle, color: "blue" }
    ],
    COMPLETED: [],
  };

  const allowedActions = validTransitions[disbursement.status] || [];
  const isAnyPending = isStandardPending || isStripePending;

  return (
    <Dialog open={open} onOpenChange={(val) => { onOpenChange(val); if(!val) form.reset(); setServerError(null); }}>
      <DialogContent className="sm:max-w-137.5 max-h-[90vh] overflow-y-auto custom-scrollbar rounded-[2rem] border-border/50 bg-background/95 p-0 shadow-2xl backdrop-blur-xl">
        
        {/* Header */}
        <div className="px-6 pt-8 sm:px-8 border-b border-border/40 bg-muted/10 pb-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
              <Banknote className="h-6 w-6 text-emerald-500" /> Process Funds
            </DialogTitle>
            <DialogDescription className="mt-1.5 font-medium text-muted-foreground">
              Updating payout for <span className="font-bold text-foreground">{disbursement.student.user.name}</span>.
            </DialogDescription>
          </DialogHeader>
        </div>

        {allowedActions.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500 mb-3" />
            <p className="font-bold text-foreground">This disbursement is Completed.</p>
            <p className="text-sm">No further actions can be taken.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }} className="flex flex-col">
            
            {/* 🚨 THE FIX: Subscribe to the form state reactively! 🚨 */}
            <form.Subscribe selector={(s) => [s.canSubmit, s.values.action] as const}>
              {([canSubmit, selectedAction]) => (
                <>
                  <div className="p-6 sm:p-8 space-y-6">
                    
                    {/* Amount Display */}
                    <div className="flex items-center justify-between rounded-xl border border-border/40 bg-card p-4 shadow-sm">
                      <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Payout Amount</span>
                      <span className="text-2xl font-black text-emerald-500">৳{disbursement.amount.toLocaleString()}</span>
                    </div>

                    {/* Action Selection */}
                    <form.Field name="action">
                      {(field) => (
                        <div className="space-y-3">
                          <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Action Method</Label>
                          <div className={`grid gap-3 ${allowedActions.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                            {allowedActions.map((action) => {
                              const Icon = action.icon;
                              const isSelected = field.state.value === action.value;
                              return (
                                <button
                                  key={action.value} type="button"
                                  onClick={() => field.handleChange(action.value as any)}
                                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${
                                    isSelected ? `border-${action.color}-500 bg-${action.color}-500/10 shadow-md` : "border-border/60 bg-card hover:bg-muted"
                                  }`}
                                >
                                  <Icon className={`h-6 w-6 ${isSelected ? `text-${action.color}-600` : "text-muted-foreground"}`} />
                                  <span className={`text-sm font-bold ${isSelected ? `text-${action.color}-700 dark:text-${action.color}-400` : "text-foreground"}`}>
                                    {action.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </form.Field>

                    {/* ─── STRIPE EXPANDING SECTION ─── */}
                    <AnimatePresence mode="wait">
                      {selectedAction === "STRIPE" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <form.Field name="stripeAccountId">
                            {(field) => (
                              <div className="space-y-2 rounded-xl border border-violet-500/30 bg-violet-500/5 p-5">
                                <Label className="font-bold text-violet-700 dark:text-violet-400 flex items-center gap-2">
                                  <CreditCard className="h-4 w-4" /> Destination Stripe Account ID
                                </Label>
                                <Input
                                  value={field.state.value} 
                                  onChange={(e) => field.handleChange(e.target.value)}
                                  placeholder="e.g. acct_1Nxyz..." 
                                  className="bg-background border-violet-500/30 focus:border-violet-500"
                                />
                                <p className="text-xs font-medium text-violet-600/70 dark:text-violet-400/70">
                                  Required to automatically route funds to the student's connected account.
                                </p>
                              </div>
                            )}
                          </form.Field>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Remarks Section */}
                    <AnimatePresence mode="wait">
                      {selectedAction !== "STRIPE" && selectedAction !== "" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <form.Field name="remarks">
                            {(field) => (
                              <div className="space-y-2">
                                <Label className="font-bold text-foreground">Remarks <span className="text-muted-foreground font-normal">(optional)</span></Label>
                                <Textarea
                                  value={field.state.value} onChange={(e) => field.handleChange(e.target.value)}
                                  placeholder="Add bank reference IDs or failure notes..." rows={3}
                                  className="rounded-xl resize-none bg-background"
                                />
                              </div>
                            )}
                          </form.Field>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Server Error */}
                    <AnimatePresence>
                      {serverError && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                          <Alert variant="destructive" className="border-rose-500/30 bg-rose-500/10 text-rose-600 rounded-xl">
                            <AlertDescription className="font-bold text-sm">{serverError}</AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Footer */}
                  <DialogFooter className="border-t border-border/40 bg-muted/10 px-6 py-5 sm:px-8">
                    <AppSubmitButton
                      isPending={isAnyPending}
                      pendingLabel={selectedAction === "STRIPE" ? "Initiating Transfer..." : "Processing..."}
                      disabled={!selectedAction} // 🚨 Now properly reactive!
                      className="h-12 w-full rounded-xl font-black text-white shadow-lg transition-all"
                      style={{ 
                        background: selectedAction === "STRIPE" 
                          ? `linear-gradient(135deg, #6366f1, #8b5cf6)` // Stripe Purple/Indigo 
                          : `linear-gradient(135deg, #4b2875, #0097b2)` // Standard Brand Gradient
                      }}
                    >
                      {selectedAction === "STRIPE" ? "Authorize Stripe Payout" : "Confirm Action"}
                    </AppSubmitButton>
                  </DialogFooter>
                </>
              )}
            </form.Subscribe>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}