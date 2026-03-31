"use client";

import { registerAction } from "@/app/(commonLayout)/(auth)/register/_actions";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { IRegisterPayload, registerFieldSchemas } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion, easeOut } from "framer-motion";
import { Eye, EyeOff, GraduationCap, Sparkles, FileCheck, Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner"; // 🚨 Added Sonner import

import { BookOpen, PenTool, Lightbulb, Target, Pencil, Ruler } from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Brand ───
const BRAND = {
  teal: "#0097b2",
  purple: "#4b2875",
};

// ─── Left Panel Decorative Orbs ───
const panelOrbs = [
  { size: "w-32 h-32", left: "10%", top: "15%", duration: 18, delay: 0 },
  { size: "w-48 h-48", left: "55%", top: "55%", duration: 22, delay: 2 },
  { size: "w-24 h-24", left: "70%", top: "8%", duration: 15, delay: 4 },
  { size: "w-36 h-36", left: "15%", top: "70%", duration: 20, delay: 1 },
];

const floatingIcons = [
  { Icon: PenTool, left: "6%", top: "6%", size: 32, duration: 16, delay: 0, rotate: -15 },
  {
    Icon: BookOpen,
    left: "76%",
    top: "10%",
    size: 36,
    duration: 19,
    delay: 2,
    rotate: 10,
  },
  {
    Icon: GraduationCap,
    left: "82%",
    top: "42%",
    size: 34,
    duration: 14,
    delay: 4,
    rotate: -8,
  },
  {
    Icon: Lightbulb,
    left: "10%",
    top: "40%",
    size: 28,
    duration: 18,
    delay: 1,
    rotate: 12,
  },
  {
    Icon: Target,
    left: "70%",
    top: "76%",
    size: 30,
    duration: 20,
    delay: 3,
    rotate: -20,
  },
  { Icon: Pencil, left: "18%", top: "82%", size: 26, duration: 15, delay: 5, rotate: 25 },
  { Icon: Ruler, left: "48%", top: "4%", size: 28, duration: 17, delay: 2.5, rotate: -5 },
  {
    Icon: BookOpen,
    left: "86%",
    top: "85%",
    size: 24,
    duration: 21,
    delay: 1.5,
    rotate: 15,
  },
];

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Matching",
    desc: "Smart scholarship recommendations",
  },
  {
    icon: FileCheck,
    title: "Simple Applications",
    desc: "Apply with ease in minutes",
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    desc: "Stay updated on your status",
  },
];

// ─── Animation Variants ───
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
const StudentRegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      // 🚨 Added: Start the loading toast
      const toastId = toast.loading("Creating your account...");

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (await mutateAsync(value)) as any;
        if (result?.success) {
          // 🚨 Added: Show success toast
          toast.success("Registration successful! Redirecting...", { id: toastId });
          router.push(`/verify-email?email=${encodeURIComponent(result.email)}`);
        } else {
          setServerError(result?.message || "Registration failed");
          setShakeKey((prev) => prev + 1);
          // 🚨 Added: Show error toast
          toast.error(result?.message || "Registration failed", { id: toastId });
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Registration failed";
        setServerError(message);
        setShakeKey((prev) => prev + 1);
        // 🚨 Added: Show error toast
        toast.error(message, { id: toastId });
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
          <EyeOff className="size-4 text-muted-foreground" aria-hidden="true" />
        ) : (
          <Eye className="size-4 text-muted-foreground" aria-hidden="true" />
        )}
      </motion.div>
    </Button>
  );

  return (
    <section className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-xl lg:max-w-5xl mx-auto"
      >
        <div className="overflow-hidden rounded-2xl shadow-2xl border border-border/40 flex flex-col lg:flex-row bg-card dark:bg-card/95">
          {/* ═══════════════════════════════════════════════
              LEFT PANEL — Brand (hidden on mobile)
              ═══════════════════════════════════════════════ */}
          <div
            className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col items-center justify-center p-10 text-white"
            style={{
              background: `linear-gradient(160deg, ${BRAND.teal} 0%, ${BRAND.purple} 100%)`,
            }}
          >
            {/* Floating orbs */}
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

            {/* Floating educational icons */}
            {floatingIcons.map((item, i) => (
              <motion.div
                key={`icon-${i}`}
                className="absolute text-white/20"
                style={{
                  left: item.left,
                  top: item.top,
                }}
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

            {/* Dot pattern */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />

            {/* Content */}
            <motion.div
              variants={panelContainerVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10 space-y-8"
            >
              <motion.div variants={panelItemVariants} className="flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 ring-1 ring-white/10">
                  <GraduationCap className="size-12 text-white" />
                </div>
              </motion.div>

              <motion.div variants={panelItemVariants} className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Start Your Journey</h2>
                <p className="text-white/70 text-sm leading-relaxed max-w-65 mx-auto">
                  Create your account and discover scholarships tailored for you
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
                      <p className="text-xs text-white/60 mt-0.5">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ═══════════════════════════════════════════════
              RIGHT PANEL — Form
              ═══════════════════════════════════════════════ */}
          <div className="flex-1 flex flex-col">
            {/* Gradient accent bar — mobile only */}
            <div
              className="h-1 lg:hidden"
              style={{
                background: `linear-gradient(90deg, ${BRAND.teal}, ${BRAND.purple})`,
              }}
            />

            <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              {/* Mobile logo — hidden on desktop */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.35,
                  delay: 0.1,
                  ease: "easeOut",
                }}
                className="flex justify-center mb-6 lg:hidden"
              >
                <Image
                  src="/logo.png"
                  alt="ScholarSync"
                  width={200}
                  height={80}
                  className="h-16 w-auto object-contain"
                  style={{ width: "auto" }}
                  priority
                />
              </motion.div>

              {/* Heading */}
              <div className="text-center lg:text-left mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Join as a student and explore scholarships
                </p>
              </div>

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
                  {/* Row 1: Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div variants={formItemVariants}>
                      <form.Field
                        name="name"
                        validators={{
                          onChange: registerFieldSchemas.name,
                        }}
                      >
                        {(field) => (
                          <AppField
                            field={field}
                            label="Full Name"
                            type="text"
                            placeholder="Enter your full name"
                          />
                        )}
                      </form.Field>
                    </motion.div>

                    <motion.div variants={formItemVariants}>
                      <form.Field
                        name="email"
                        validators={{
                          onChange: registerFieldSchemas.email,
                        }}
                      >
                        {(field) => (
                          <AppField
                            field={field}
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                          />
                        )}
                      </form.Field>
                    </motion.div>
                  </div>

                  {/* Row 2: Password + Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div variants={formItemVariants}>
                      <form.Field
                        name="password"
                        validators={{
                          onChange: registerFieldSchemas.password,
                        }}
                      >
                        {(field) => (
                          <AppField
                            field={field}
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            append={renderPasswordToggle(showPassword, () =>
                              setShowPassword((v) => !v),
                            )}
                          />
                        )}
                      </form.Field>
                    </motion.div>

                    <motion.div variants={formItemVariants}>
                      <form.Field
                        name="confirmPassword"
                        validators={{
                          onChangeListenTo: ["password"],
                          onChange: ({ value, fieldApi }) => {
                            if (!value) return "Please confirm your password";
                            const password = fieldApi.form.getFieldValue("password");
                            if (value !== password) return "Passwords do not match";
                            return undefined;
                          },
                        }}
                      >
                        {(field) => (
                          <AppField
                            field={field}
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            append={renderPasswordToggle(showConfirmPassword, () =>
                              setShowConfirmPassword((v) => !v),
                            )}
                          />
                        )}
                      </form.Field>
                    </motion.div>
                  </div>

                  {/* Server Error */}
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
                      >
                        <Alert variant="destructive">
                          <AlertDescription>{serverError}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.div variants={formItemVariants}>
                    <form.Subscribe
                      selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                    >
                      {([canSubmit, isSubmitting]) => (
                        <AppSubmitButton
                          isPending={isSubmitting || isPending}
                          pendingLabel="Creating account..."
                          disabled={!canSubmit}
                          className="text-white font-semibold shadow-lg hover:shadow-xl hover:opacity-90"
                          style={{
                            background: `linear-gradient(135deg, ${BRAND.teal}, ${BRAND.purple})`,
                          }}
                        >
                          Create Account
                        </AppSubmitButton>
                      )}
                    </form.Subscribe>
                  </motion.div>
                </form>
              </motion.div>

              {/* Divider + Google */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.5,
                  ease: "easeOut",
                }}
              >
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-card text-muted-foreground text-xs uppercase tracking-wider">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-sm active:scale-[0.98] cursor-pointer"
                  onClick={() => {
                    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                    window.location.href = `${baseUrl}/auth/login/google`;
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                  </svg>
                  Sign up with Google
                </Button>
              </motion.div>

              {/* Admin Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="mt-4"
              >
                <div className="rounded-lg border border-dashed p-3 text-center border-[#4b287540] dark:border-[#4b287570]">
                  <p className="text-sm text-muted-foreground">
                    Are you a university administrator?{" "}
                    <Link
                      href="/register-admin"
                      className="font-semibold underline-offset-4 hover:underline transition-all text-[#4b2875] dark:text-purple-400"
                    >
                      Register your university →
                    </Link>
                  </p>
                </div>
              </motion.div>

              {/* Footer */}
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold underline-offset-4 hover:underline transition-all"
                  style={{ color: BRAND.teal }}
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default StudentRegisterForm;
