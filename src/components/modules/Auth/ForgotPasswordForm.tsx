"use client";

import { forgotPasswordAction } from "@/app/(commonLayout)/(auth)/forgot-password/_actions";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IForgotPasswordPayload, forgotPasswordZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion, easeOut } from "framer-motion";
import {
  LockKeyhole,
  Mail,
  ShieldCheck,
  Key,
  ShieldAlert,
  ArrowLeft,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  { Icon: Key, left: "6%", top: "6%", size: 32, duration: 16, delay: 0, rotate: -15 },
  { Icon: ShieldAlert, left: "76%", top: "10%", size: 36, duration: 19, delay: 2, rotate: 10 },
  { Icon: LockKeyhole, left: "82%", top: "42%", size: 34, duration: 14, delay: 4, rotate: -8 },
  { Icon: Mail, left: "10%", top: "40%", size: 28, duration: 18, delay: 1, rotate: 12 },
  { Icon: ShieldCheck, left: "70%", top: "76%", size: 30, duration: 20, delay: 3, rotate: -20 },
  { Icon: Key, left: "18%", top: "82%", size: 26, duration: 15, delay: 5, rotate: 25 },
];

const features = [
  {
    icon: Search,
    title: "Account Identification",
    desc: "We securely locate your student or admin profile",
  },
  {
    icon: Mail,
    title: "OTP Verification",
    desc: "A temporary code is sent to your registered email",
  },
  {
    icon: LockKeyhole,
    title: "Secure Reset",
    desc: "Create a new password and regain access instantly",
  },
];

// ─── Animations ───
const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const formItemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: easeOut },
  },
};

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

// ─── Component ───
const ForgotPasswordForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IForgotPasswordPayload) => forgotPasswordAction(payload),
  });

  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (await mutateAsync(value)) as any;
        if (result?.success) {
          router.push(`/reset-password?email=${encodeURIComponent(value.email)}`);
        } else {
          setServerError(result?.message || "Failed to send reset link");
          setShakeKey((prev) => prev + 1);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Request failed";
        setServerError(message);
        setShakeKey((prev) => prev + 1);
      }
    },
  });

  return (
    <section className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 lg:p-8 ">
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
                  <ShieldCheck className="size-12 text-white" />
                </div>
              </motion.div>

              <motion.div
                variants={panelItemVariants}
                className="text-center space-y-2"
              >
                <h2 className="text-2xl font-bold tracking-tight">
                  Secure Recovery
                </h2>
                <p className="text-white/70 text-sm leading-relaxed max-w-65 mx-auto">
                  Follow the steps to safely regain access to your account.
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

              {/* Lock icon — desktop only */}
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
                  <LockKeyhole
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
                className="text-center mb-6"
              >
                <h1 className="text-2xl font-bold tracking-tight">
                  Forgot Password?
                </h1>
                <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
                  Enter your registered email address and we&apos;ll send you an OTP to reset your password.
                </p>
              </motion.div>

              {/* Form */}
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
                  <motion.div variants={formItemVariants}>
                    <form.Field
                      name="email"
                      validators={{
                        onChange: forgotPasswordZodSchema.shape.email,
                      }}
                    >
                      {(field) => (
                        <AppField
                          field={field}
                          label="Account Email"
                          type="email"
                          placeholder="Enter your registered email"
                        />
                      )}
                    </form.Field>
                  </motion.div>

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

                  {/* Submit Button */}
                  <motion.div variants={formItemVariants}>
                    <form.Subscribe
                      selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                    >
                      {([canSubmit, isSubmitting]) => (
                        <AppSubmitButton
                          isPending={isSubmitting || isPending}
                          pendingLabel="Sending Code..."
                          disabled={!canSubmit}
                          className="text-white font-semibold shadow-lg hover:shadow-xl hover:opacity-90 w-full"
                          style={{
                            background: `linear-gradient(135deg, ${BRAND.teal}, ${BRAND.purple})`,
                          }}
                        >
                          Send Reset Code
                        </AppSubmitButton>
                      )}
                    </form.Subscribe>
                  </motion.div>
                </form>
              </motion.div>

              {/* Back to login */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="mt-8 text-center"
              >
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground font-medium hover:text-foreground transition-colors group"
                >
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" style={{ color: BRAND.teal }} />
                  Back to login
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ForgotPasswordForm;