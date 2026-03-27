"use client";

import {
  verifyEmailAction,
  resendOtpAction,
} from "@/app/(commonLayout)/(auth)/verify-email/_actions";
import AppOtpField from "@/components/shared/form/AppOtpField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion, easeOut } from "framer-motion";
import {
  GraduationCap,
  MailCheck,
  ShieldCheck,
  Timer,
  BookOpen,
  PenTool,
  Lightbulb,
  Target,
  Pencil,
  Ruler,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

// ─── Brand ───
const BRAND = {
  teal: "#0097b2",
  purple: "#4b2875",
};

// ─── Left Panel ───
const panelOrbs = [
  { size: "w-32 h-32", left: "10%", top: "15%", duration: 18, delay: 0 },
  { size: "w-48 h-48", left: "55%", top: "55%", duration: 22, delay: 2 },
  { size: "w-24 h-24", left: "70%", top: "8%", duration: 15, delay: 4 },
  { size: "w-36 h-36", left: "15%", top: "70%", duration: 20, delay: 1 },
];

const floatingIcons = [
  { Icon: PenTool, left: "6%", top: "6%", size: 32, duration: 16, delay: 0, rotate: -15 },
  { Icon: BookOpen, left: "76%", top: "10%", size: 36, duration: 19, delay: 2, rotate: 10 },
  { Icon: GraduationCap, left: "82%", top: "42%", size: 34, duration: 14, delay: 4, rotate: -8 },
  { Icon: Lightbulb, left: "10%", top: "40%", size: 28, duration: 18, delay: 1, rotate: 12 },
  { Icon: Target, left: "70%", top: "76%", size: 30, duration: 20, delay: 3, rotate: -20 },
  { Icon: Pencil, left: "18%", top: "82%", size: 26, duration: 15, delay: 5, rotate: 25 },
  { Icon: Ruler, left: "48%", top: "4%", size: 28, duration: 17, delay: 2.5, rotate: -5 },
  { Icon: BookOpen, left: "86%", top: "85%", size: 24, duration: 21, delay: 1.5, rotate: 15 },
];

const features = [
  {
    icon: MailCheck,
    title: "Check Your Inbox",
    desc: "We sent a 6-digit code to your email",
  },
  {
    icon: Timer,
    title: "Code Expires Soon",
    desc: "Enter the code within 10 minutes",
  },
  {
    icon: ShieldCheck,
    title: "Secure Verification",
    desc: "One-time code for your protection",
  },
];

// ─── Animations ───
const panelContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const panelItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: easeOut },
  },
};

// ─── Constants ───
const RESEND_COOLDOWN = 60; // seconds

// ─── Component ───
interface VerifyEmailFormProps {
  email?: string;
}

const VerifyEmailForm = ({ email: initialEmail }: VerifyEmailFormProps) => {
  const [otp, setOtp] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  const email = initialEmail || "";

  // ─── Verify mutation ───
  const {
    mutateAsync: verify,
    isPending: isVerifying,
  } = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyEmailAction(email, otp),
  });

  // ─── Resend mutation ───
  const {
    mutateAsync: resend,
    isPending: isResending,
  } = useMutation({
    mutationFn: (email: string) => resendOtpAction(email),
  });

  // ─── Cooldown timer ───
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // ─── Start cooldown on mount (OTP was just sent during registration) ───
  useEffect(() => {
    if (email) {
      setCooldown(RESEND_COOLDOWN);
    }
  }, [email]);

  // ─── Handlers ───
  const handleVerify = useCallback(async () => {
    setServerError(null);
    setSuccessMessage(null);

    if (!email) {
      setServerError("Email is missing. Please go back and register again.");
      setShakeKey((prev) => prev + 1);
      return;
    }

    if (otp.length !== 6) {
      setServerError("Please enter the complete 6-digit code");
      setShakeKey((prev) => prev + 1);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (await verify({ email, otp })) as any;
      if (result && !result.success) {
        setServerError(result.message || "Verification failed");
        setShakeKey((prev) => prev + 1);
        setOtp("");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Verification failed";
      setServerError(message);
      setShakeKey((prev) => prev + 1);
    }
  }, [email, otp, verify]);

  const handleResend = useCallback(async () => {
    if (cooldown > 0 || !email) return;

    setServerError(null);
    setSuccessMessage(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (await resend(email)) as any;
      if (result.success) {
        setSuccessMessage(result.message || "OTP sent successfully");
        setCooldown(RESEND_COOLDOWN);
        setOtp("");
      } else {
        setServerError(result.message || "Failed to resend");
        setShakeKey((prev) => prev + 1);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to resend";
      setServerError(message);
      setShakeKey((prev) => prev + 1);
    }
  }, [email, cooldown, resend]);

  // ─── Auto-submit when OTP is complete ───
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp, handleVerify]);

  return (
    <section className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 lg:p-8 bg-linear-to-br from-background via-background to-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md lg:max-w-4xl mx-auto"
      >
        <div className="overflow-hidden rounded-2xl shadow-2xl border border-border/40 flex flex-col lg:flex-row bg-card dark:bg-card/95">
          {/* ═══ LEFT PANEL ═══ */}
          <div
            className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col items-center justify-center p-10 text-white"
            style={{
              background: `linear-gradient(160deg, ${BRAND.teal} 0%, ${BRAND.purple} 100%)`,
            }}
          >
            {panelOrbs.map((orb, i) => (
              <motion.div
                key={`orb-${i}`}
                className={`absolute rounded-full ${orb.size} blur-3xl bg-white/6`}
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
                className="absolute text-white/20"
                style={{ left: item.left, top: item.top }}
                animate={{
                  y: [0, -12, 0, 12, 0],
                  x: [0, 6, 0, -6, 0],
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
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            <motion.div
              variants={panelContainerVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10 space-y-8"
            >
              <motion.div
                variants={panelItemVariants}
                className="flex justify-center"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 ring-1 ring-white/10">
                  <MailCheck className="size-12 text-white" />
                </div>
              </motion.div>

              <motion.div
                variants={panelItemVariants}
                className="text-center space-y-2"
              >
                <h2 className="text-2xl font-bold tracking-tight">
                  Verify Your Email
                </h2>
                <p className="text-white/70 text-sm leading-relaxed max-w-65 mx-auto">
                  Just one more step to unlock your ScholarSync account
                </p>
              </motion.div>

              <div className="space-y-3 pt-4">
                {features.map((feature) => (
                  <motion.div
                    key={feature.title}
                    variants={panelItemVariants}
                    className="flex items-start gap-3 bg-white/6 backdrop-blur-sm rounded-xl p-3.5 ring-1 ring-white/8"
                  >
                    <div className="shrink-0 mt-0.5 bg-white/10 rounded-lg p-2">
                      <feature.icon className="size-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-tight">
                        {feature.title}
                      </p>
                      <p className="text-xs text-white/60 mt-0.5">
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ═══ RIGHT PANEL ═══ */}
          <div className="flex-1 flex flex-col">
            <div
              className="h-1 lg:hidden"
              style={{
                background: `linear-gradient(90deg, ${BRAND.teal}, ${BRAND.purple})`,
              }}
            />

            <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              {/* Mobile logo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
                className="flex justify-center mb-6 lg:hidden"
              >
                <Image
                  src="/logo.png"
                  alt="ScholarSync"
                  width={200}
                  height={80}
                  className="h-16 w-auto object-contain"
                  priority
                />
              </motion.div>

              {/* Mail icon — desktop only */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.15,
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 200,
                }}
                className="hidden lg:flex justify-center mb-6"
              >
                <div
                  className="flex items-center justify-center size-16 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.teal}15, ${BRAND.purple}15)`,
                  }}
                >
                  <MailCheck
                    className="size-8"
                    style={{ color: BRAND.teal }}
                  />
                </div>
              </motion.div>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-center mb-2"
              >
                <h1 className="text-2xl font-bold tracking-tight">
                  Check Your Email
                </h1>
                <p className="text-sm text-muted-foreground mt-2">
                  We&apos;ve sent a 6-digit verification code to
                </p>
                {email && (
                  <p
                    className="text-sm font-semibold mt-1"
                    style={{ color: BRAND.teal }}
                  >
                    {email}
                  </p>
                )}
              </motion.div>

              {/* OTP Input */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="my-8"
              >
                <AppOtpField
                  length={6}
                  value={otp}
                  onChange={setOtp}
                  hasError={!!serverError}
                  errorMessage={serverError || undefined}
                  disabled={isVerifying}
                />
              </motion.div>

              {/* Success Message */}
              <AnimatePresence mode="wait">
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-4"
                  >
                    <Alert className="border-green-500/30 bg-green-500/5">
                      <AlertDescription className="text-green-600 dark:text-green-400">
                        {successMessage}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error with Shake */}
              <AnimatePresence mode="wait">
                {serverError && (
                  <motion.div
                    key={shakeKey}
                    initial={{ opacity: 0, x: 0 }}
                    animate={{
                      opacity: 1,
                      x: [0, -8, 8, -6, 6, -3, 3, 0],
                    }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{
                      opacity: { duration: 0.2 },
                      x: { duration: 0.4, ease: "easeInOut" },
                    }}
                    className="mb-4"
                  >
                    <Alert variant="destructive">
                      <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Verify Button */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <AppSubmitButton
                  isPending={isVerifying}
                  pendingLabel="Verifying..."
                  disabled={otp.length !== 6}
                  className="text-white font-semibold shadow-lg hover:shadow-xl hover:opacity-90"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.teal}, ${BRAND.purple})`,
                  }}
                >
                  Verify Email
                </AppSubmitButton>
              </motion.div>

              {/* Resend */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="mt-6 text-center"
              >
                <p className="text-sm text-muted-foreground">
                  Didn&apos;t receive the code?{" "}
                  {cooldown > 0 ? (
                    <span className="font-medium">
                      Resend in{" "}
                      <span style={{ color: BRAND.teal }}>
                        {cooldown}s
                      </span>
                    </span>
                  ) : (
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleResend}
                      disabled={isResending || !email}
                      className="p-0 h-auto font-semibold underline-offset-4 hover:underline cursor-pointer"
                      style={{ color: BRAND.purple }}
                    >
                      {isResending ? "Sending..." : "Resend Code"}
                    </Button>
                  )}
                </p>
              </motion.div>

              {/* Back to login */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="mt-4 text-center"
              >
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground font-medium hover:underline underline-offset-4 transition-all"
                >
                  ← Back to login
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default VerifyEmailForm;