// src/app/(dashboardLayout)/(superAdminRoutes)/super-admin/users-management/_components/ChangeUserStatusModal.tsx

"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { RefreshCw, ArrowDown, AlertCircle } from "lucide-react";

import type { IUser, UserStatus } from "@/types/user";
import {
  USER_STATUS_LABELS,
  USER_STATUS_COLORS,
  VALID_USER_STATUS_TRANSITIONS,
} from "@/types/user";

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
import { changeUserStatusAction } from "@/app/(dashboardLayout)/(superAdminRoutes)/super-admin/users-management/_actions";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser | null;
  onSuccess: () => void;
}

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

export default function ChangeUserStatusModal({
  open,
  onOpenChange,
  user,
  onSuccess,
}: Props) {
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: { status: string }) =>
      changeUserStatusAction(user!.id, payload),
  });

  const form = useForm({
    defaultValues: {
      status: "" as UserStatus,
    },
    onSubmit: async ({ value }) => {
      if (!user) return;
      setServerError(null);
      const toastId = toast.loading("Updating status...");

      try {
        const result = await mutateAsync(value);
        if (result.success) {
          toast.success(result.message, { id: toastId });
          onOpenChange(false);
          onSuccess();
        } else {
          setServerError(result.message);
          toast.error(result.message, { id: toastId });
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
    if (user) form.reset();
    setServerError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return null;

  const validTargets = VALID_USER_STATUS_TRANSITIONS[user.status] || [];
  const currentColor = USER_STATUS_COLORS[user.status] ?? "#6b7280";

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
          <DialogTitle>Change Status for {user.name}</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="px-6 pt-8 pb-4 sm:px-8 border-b border-border/40 bg-muted/10">
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-inner border border-primary/20"
              style={{
                background: `linear-gradient(135deg, ${BRAND_PURPLE}15, ${BRAND_TEAL}15)`,
              }}
            >
              <RefreshCw
                className="h-6 w-6"
                style={{ color: BRAND_TEAL }}
              />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                Update User Status
              </h2>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                Modifying status for{" "}
                <span className="font-bold text-foreground">{user.name}</span>{" "}
                ({user.email}).
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
          <div className="px-6 py-8 sm:px-8 bg-card">
            {/* Current Status */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-muted/20 p-5 shadow-sm">
              <span className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Current State
              </span>
              <Badge
                className="px-4 py-1.5 text-sm shadow-sm font-bold"
                style={{
                  backgroundColor: `${currentColor}15`,
                  color: currentColor,
                  border: `1px solid ${currentColor}40`,
                }}
              >
                {USER_STATUS_LABELS[user.status]}
              </Badge>
            </div>

            {validTargets.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
                <AlertCircle className="mb-3 h-8 w-8 text-rose-500" />
                <p className="text-sm font-medium text-rose-600 dark:text-rose-400">
                  No status transitions available from{" "}
                  <strong>{USER_STATUS_LABELS[user.status]}</strong>.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-center py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/50 bg-background shadow-sm text-muted-foreground">
                    <ArrowDown className="h-4 w-4" />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/50 bg-muted/20 p-5 shadow-sm">
                  <form.Field name="status">
                    {(field) => (
                      <div className="flex flex-col items-center text-center">
                        <label className="mb-3 text-xs font-bold uppercase tracking-widest text-foreground">
                          Select New State
                        </label>
                        <Select
                          value={field.state.value}
                          onValueChange={(v) =>
                            field.handleChange(v as UserStatus)
                          }
                        >
                          <SelectTrigger className="h-12 w-full max-w-70 rounded-xl border-border/60 bg-background shadow-sm">
                            <SelectValue placeholder="Choose new status..." />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {validTargets.map((s) => (
                              <SelectItem
                                key={s}
                                value={s}
                                className="rounded-lg font-medium"
                              >
                                {USER_STATUS_LABELS[s]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {field.state.meta.errors?.length > 0 && (
                          <p className="mt-2.5 text-xs font-semibold text-destructive">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>

                <AnimatePresence mode="wait">
                  {serverError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="mt-6"
                    >
                      <Alert
                        variant="destructive"
                        className="border-rose-500/30 bg-rose-500/10 text-rose-600 rounded-xl"
                      >
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