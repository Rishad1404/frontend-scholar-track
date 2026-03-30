/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { resetPasswordAction } from "@/app/(commonLayout)/(auth)/reset-password/_actions";
import AppField from "@/components/shared/form/AppField";
import AppOtpField from "@/components/shared/form/AppOtpField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  IResetPasswordPayload,
  resetPasswordFieldSchemas,
} from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion, easeOut } from "framer-motion";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner"; // 🚨 Added Sonner import

// ─── Brand ───
const BRAND = {
  teal: "#0097b2",
  purple: "#4b2875",
};

// ─── Left Panel Background Elements ───
const floatingIcons = [
  {
    Icon: KeyRound,
    left: "10%",
    top: "15%",
    size: 40,
    duration: 18,
    delay: 0,
    rotate: -20,
  },
  {
    Icon: ShieldCheck,
    left: "75%",
    top: "10%",
    size: 48,
    duration: 22,
    delay: 2,
    rotate: 15,
  },
  {
    Icon: LockKeyhole,
    left: "80%",
    top: "65%",
    size: 56,
    duration: 15,
    delay: 4,
    rotate: -10,
  },
  {
    Icon: CheckCircle2,
    left: "15%",
    top: "75%",
    size: 42,
    duration: 20,
    delay: 1,
    rotate: 25,
  },
];

const panelOrbs = [
  { size: "w-40 h-40", left: "5%", top: "10%", duration: 18, delay: 0 },
  { size: "w-56 h-56", left: "50%", top: "50%", duration: 22, delay: 2 },
  { size: "w-32 h-32", left: "70%", top: "5%", duration: 15, delay: 4 },
];

// ─── Animations ───
const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const formItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut } },
};

const panelContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const panelItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: easeOut } },
};

interface ResetPasswordFormProps {
  email?: string;
}

export default function ResetPasswordForm({
  email: initialEmail,
}: ResetPasswordFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP state managed separately for the AppOtpField
  const [otp, setOtp] = useState("");

  const router = useRouter();
  const email = initialEmail || "";

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IResetPasswordPayload) => resetPasswordAction(payload),
  });

  const form = useForm({
    defaultValues: { email: email, otp: "", newPassword: "", confirmPassword: "" },
    onSubmit: async ({ value }) => {
      setServerError(null);

      // Inject OTP from state into the form payload before submitting
      const payload = { ...value, otp };

      if (otp.length !== 6) {
        setServerError("Please enter the complete 6-digit OTP");
        setShakeKey((prev) => prev + 1);
        return;
      }

      // 🚨 Start the premium loading toast
      const toastId = toast.loading("Resetting password...");

      try {
        const result = (await mutateAsync(payload)) as any;
        if (result?.success) {
          setSuccessMessage("Password reset successfully! Redirecting to login...");
          // 🚨 Update toast to success
          toast.success("Password reset successfully!", { id: toastId });
          setTimeout(() => {
            router.push("/login?reset=success");
          }, 2000);
        } else {
          setServerError(result?.message || "Failed to reset password");
          setShakeKey((prev) => prev + 1);
          // 🚨 Update toast to error
          toast.error(result?.message || "Failed to reset password", { id: toastId });
        }
      } catch (error: unknown) {
        setServerError(error instanceof Error ? error.message : "Request failed");
        setShakeKey((prev) => prev + 1);
        // 🚨 Update toast to error
        toast.error(error instanceof Error ? error.message : "Request failed", { id: toastId });
      }
    },
  });

  const renderPasswordToggle = (isVisible: boolean, toggle: () => void) => (
    <Button
      type="button"
      onClick={toggle}
      variant="ghost"
      size="icon"
      className="hover:bg-transparent h-auto w-auto cursor-pointer"
      aria-label={isVisible ? "Hide password" : "Show password"}
    >
      <motion.div
        key={isVisible ? "hide" : "show"}
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {isVisible ? (
          <EyeOff className="size-4 text-muted-foreground" />
        ) : (
          <Eye className="size-4 text-muted-foreground" />
        )}
      </motion.div>
    </Button>
  );

  return (
    <section className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 lg:p-8 bg-linear-to-br from-background via-background to-muted/30 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-xl lg:max-w-5xl mx-auto"
      >
        <div className="overflow-hidden rounded-2xl shadow-2xl border border-border/40 flex flex-col lg:flex-row bg-card dark:bg-card/95">
          {/* ════ LEFT PANEL ════ */}
          <div
            className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col items-center justify-center p-10 xl:p-12 text-white"
            style={{
              background: `linear-gradient(160deg, ${BRAND.purple} 0%, ${BRAND.teal} 100%)`,
            }}
          >
            {/* Orbs & Icons */}
            {panelOrbs.map((orb, i) => (
              <motion.div
                key={`orb-${i}`}
                className={`absolute rounded-full ${orb.size} blur-3xl bg-white/10`}
                style={{ left: orb.left, top: orb.top }}
                animate={{
                  y: [0, -20, 0, 20, 0],
                  x: [0, 15, 0, -15, 0],
                  scale: [1, 1.05, 1, 0.95, 1],
                }}
                transition={{
                  duration: orb.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: orb.delay,
                }}
              />
            ))}
            {floatingIcons.map((item, i) => (
              <motion.div
                key={`icon-${i}`}
                className="absolute text-white/30 drop-shadow-md"
                style={{ left: item.left, top: item.top }}
                animate={{
                  y: [0, -12, 0, 12, 0],
                  rotate: [
                    item.rotate,
                    item.rotate + 10,
                    item.rotate,
                    item.rotate - 10,
                    item.rotate,
                  ],
                }}
                transition={{
                  duration: item.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay,
                }}
              >
                <item.Icon size={item.size} strokeWidth={1.5} />
              </motion.div>
            ))}

            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            <motion.div
              variants={panelContainerVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10 space-y-8 w-full max-w-sm text-center"
            >
              <motion.div variants={panelItemVariants} className="flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 ring-1 ring-white/20 shadow-xl">
                  <KeyRound className="size-14 text-white" />
                </div>
              </motion.div>

              <motion.div variants={panelItemVariants} className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tight">Create New Password</h2>
                <p className="text-white/80 text-[15px] leading-relaxed">
                  You're almost there. Enter the 6-digit code sent to your email along
                  with your new secure password.
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* ════ RIGHT PANEL ════ */}
          <div className="flex-1 flex flex-col">
            <div
              className="h-1 lg:hidden"
              style={{
                background: `linear-gradient(90deg, ${BRAND.purple}, ${BRAND.teal})`,
              }}
            />

            <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 lg:p-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex justify-center mb-6 lg:hidden"
              >
                <Image
                  src="/logo.png"
                  alt="ScholarTrack"
                  width={200}
                  height={80}
                  className="h-14 w-auto object-contain dark:brightness-0 dark:invert"
                  priority
                />
              </motion.div>

              <div className="text-center lg:text-left mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Reset Password
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Please check your email and enter the verification code.
                </p>
              </div>

              <motion.div
                variants={formContainerVariants}
                initial="hidden"
                animate="visible"
              >
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                  className="space-y-5"
                >
                  {/* Read-Only Email Field */}
                  <motion.div variants={formItemVariants}>
                    <form.Field name="email">
                      {(field) => (
                        <AppField
                          field={field}
                          label="Account Email"
                          type="email"
                          disabled={true} // Locked because it came from the URL
                          className="opacity-70"
                        />
                      )}
                    </form.Field>
                  </motion.div>

                  {/* OTP Field */}
                  <motion.div variants={formItemVariants} className="space-y-2">
                    <label className="text-sm font-medium leading-none text-foreground">
                      6-Digit Security Code
                    </label>
                    <div className="pt-2">
                      <AppOtpField
                        length={6}
                        value={otp}
                        onChange={setOtp}
                        disabled={isPending || !!successMessage}
                      />
                    </div>
                  </motion.div>

                  {/* New Password */}
                  <motion.div variants={formItemVariants}>
                    <form.Field
                      name="newPassword"
                      validators={{ onChange: resetPasswordFieldSchemas.newPassword }}
                    >
                      {(field) => (
                        <AppField
                          field={field}
                          label="New Password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a new password"
                          disabled={isPending || !!successMessage}
                          append={renderPasswordToggle(showPassword, () =>
                            setShowPassword((v) => !v),
                          )}
                        />
                      )}
                    </form.Field>
                  </motion.div>

                  {/* Confirm New Password */}
                  <motion.div variants={formItemVariants}>
                    <form.Field
                      name="confirmPassword"
                      validators={{
                        onChangeListenTo: ["newPassword"],
                        onChange: ({ value, fieldApi }) => {
                          if (!value) return "Please confirm your new password";
                          if (value !== fieldApi.form.getFieldValue("newPassword"))
                            return "Passwords do not match";
                          return undefined;
                        },
                      }}
                    >
                      {(field) => (
                        <AppField
                          field={field}
                          label="Confirm New Password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your new password"
                          disabled={isPending || !!successMessage}
                          append={renderPasswordToggle(showConfirmPassword, () =>
                            setShowConfirmPassword((v) => !v),
                          )}
                        />
                      )}
                    </form.Field>
                  </motion.div>

                  {/* Success Alert */}
                  <AnimatePresence mode="wait">
                    {successMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-1"
                      >
                        <Alert className="border-green-500/30 bg-green-500/5 py-2.5">
                          <AlertDescription className="text-sm text-green-600 dark:text-green-400 font-medium text-center">
                            {successMessage}
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Error Alert */}
                  <AnimatePresence mode="wait">
                    {serverError && !successMessage && (
                      <motion.div
                        key={shakeKey}
                        initial={{ opacity: 0, x: 0 }}
                        animate={{ opacity: 1, x: [0, -8, 8, -6, 6, -3, 3, 0] }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pt-1"
                      >
                        <Alert variant="destructive" className="py-2.5">
                          <AlertDescription className="text-sm">
                            {serverError}
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div variants={formItemVariants} className="pt-2">
                    <form.Subscribe
                      selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                    >
                      {([canSubmit, isSubmitting]) => (
                        <AppSubmitButton
                          isPending={isSubmitting || isPending}
                          pendingLabel="Resetting Password..."
                          disabled={!canSubmit || otp.length !== 6 || !!successMessage}
                          className="text-white font-semibold shadow-lg hover:shadow-xl hover:opacity-90 w-full py-6 text-md"
                          style={{
                            background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                          }}
                        >
                          Reset Password
                        </AppSubmitButton>
                      )}
                    </form.Subscribe>
                  </motion.div>
                </form>
              </motion.div>

              {/* Back to Login Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="mt-8 text-center"
              >
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <ArrowLeft
                    className="size-4 transition-transform group-hover:-translate-x-1"
                    style={{ color: BRAND.purple }}
                  />
                  Back to Login
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}