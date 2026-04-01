/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/modules/Dashboard/ChangePassword/ChangePasswordForm.tsx

"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { KeyRound, ShieldCheck, Eye, EyeOff, Lock, AlertCircle } from "lucide-react";

import { changePasswordSchema } from "@/zod/auth.validation";

import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordAction } from "@/app/(dashboardLayout)/(commonProtectedLayout)/change-password/_actions";

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

export default function ChangePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  // Visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: changePasswordAction,
  });

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      const toastId = toast.loading("Updating password...");

      try {
        const result = await mutateAsync({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        });

        if (result.success) {
          toast.success(result.message, { id: toastId });
          form.reset();
        } else {
          setServerError(result.message);
          toast.error(result.message, { id: toastId });
        }
      } catch (error: any) {
        const message = error?.message || "Something went wrong";
        setServerError(message);
        toast.error(message, { id: toastId });
      }
    },
  });

  return (
    <div className="overflow-hidden rounded-[2rem] border border-border/40 bg-card shadow-2xl">
      {/* ─── Premium Header ─── */}
      <div className="border-b border-border/40 bg-muted/10 px-8 py-10 text-center">
        <div
          className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full shadow-inner border border-primary/20 bg-background"
          style={{
            background: `linear-gradient(135deg, ${BRAND_PURPLE}15, ${BRAND_TEAL}15)`,
          }}
        >
          <ShieldCheck className="h-10 w-10 text-primary" style={{ color: BRAND_TEAL }} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Change Password
        </h1>
        <p className="mt-2 text-base font-medium text-muted-foreground">
          Ensure your account stays secure by using a strong, unique password.
        </p>
      </div>

      {/* ─── Form Body ─── */}
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="p-8 sm:p-10 space-y-8"
      >
        <div className="space-y-6">
          {/* Current Password */}
          <form.Field
            name="currentPassword"
            validators={{
              onChange: ({ value }) => {
                const res = changePasswordSchema.shape.currentPassword.safeParse(value);
                return res.success ? undefined : res.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Current Password
                </Label>
                <div className="relative">
                  <Input
                    type={showCurrent ? "text" : "password"}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Enter your current password"
                    className="h-14 rounded-xl pl-4 pr-12 text-base bg-background border-border/60 transition-colors focus:border-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCurrent ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {field.state.meta.errors?.length > 0 && (
                  <p className="text-sm font-semibold text-destructive mt-1.5">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="h-px w-full bg-border/40 my-6" />

          {/* New Password */}
          <form.Field
            name="newPassword"
            validators={{
              onChange: ({ value }) => {
                const res = changePasswordSchema.shape.newPassword.safeParse(value);
                return res.success ? undefined : res.error.issues[0].message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-emerald-500" /> New Password
                </Label>
                <div className="relative">
                  <Input
                    type={showNew ? "text" : "password"}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Create a new strong password"
                    className="h-14 rounded-xl pl-4 pr-12 text-base bg-background border-border/60 transition-colors focus:border-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNew ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {field.state.meta.errors?.length > 0 && (
                  <p className="text-sm font-semibold text-destructive mt-1.5">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Confirm New Password */}
          <form.Field
            name="confirmPassword"
            // 🚨 Deleted the problematic 'listenTo' line entirely
            validators={{
              onChange: ({ value, fieldApi }) => {
                if (!value) return "Please confirm your new password";
                // This safely fetches the other field's value in real-time
                if (value !== fieldApi.form.getFieldValue("newPassword")) {
                  return "Passwords do not match";
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Type your new password again"
                    className="h-14 rounded-xl pl-4 pr-12 text-base bg-background border-border/60 transition-colors focus:border-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirm ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {field.state.meta.errors?.length > 0 && (
                  <p className="text-sm font-semibold text-destructive mt-1.5">
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
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Alert
                variant="destructive"
                className="border-rose-500/30 bg-rose-500/10 text-rose-600 rounded-xl mt-4"
              >
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="font-semibold ml-2 text-sm">
                  {serverError}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <div className="pt-4">
          <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Securing Account..."
                disabled={!canSubmit}
                className="w-full h-14 rounded-xl font-black text-lg text-white shadow-xl transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
                }}
              >
                Update Password
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}
