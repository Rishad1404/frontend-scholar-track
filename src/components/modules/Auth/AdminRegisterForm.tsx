"use client";

import { registerAdminAction } from "@/app/(commonLayout)/(auth)/register-admin/_actions";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { IAdminRegisterPayload, adminRegisterFieldSchemas } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion, easeOut } from "framer-motion";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Shield,
  Users,
  Award,
  BookOpen,
  PenTool,
  Lightbulb,
  Target,
  Pencil,
  Ruler,
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

// ─── Floating Educational Icons ───
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

// ─── Left Panel Orbs ───
const panelOrbs = [
  { size: "w-40 h-40", left: "5%", top: "10%", duration: 18, delay: 0 },
  { size: "w-56 h-56", left: "50%", top: "50%", duration: 22, delay: 2 },
  { size: "w-32 h-32", left: "70%", top: "5%", duration: 15, delay: 4 },
  { size: "w-44 h-44", left: "10%", top: "65%", duration: 20, delay: 1 },
];

const features = [
  {
    icon: Shield,
    title: "Full Admin Control",
    desc: "Manage departments, staff, and settings from one place",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Invite department heads and reviewers to streamline workflows",
  },
  {
    icon: Award,
    title: "Scholarship Pipeline",
    desc: "Create, publish, and track scholarships end-to-end",
  },
];

const steps = [
  { number: "01", text: "Register your university" },
  { number: "02", text: "Verify your email" },
  { number: "03", text: "Set up departments & staff" },
  { number: "04", text: "Publish scholarships" },
];

// ─── Animation Variants ───
const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const formItemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: easeOut },
  },
};

const panelContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const panelItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: easeOut },
  },
};

// ─── Component ───
const AdminRegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: IAdminRegisterPayload) => registerAdminAction(data),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      universityName: "",
      website: "",
      phone: "",
      designation: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (await mutateAsync(value as IAdminRegisterPayload)) as any;
        if (result?.success) {
          router.push(`/verify-email?email=${encodeURIComponent(result.email)}`);
        } else {
          setServerError(result?.message || "Registration failed");
          setShakeKey((prev) => prev + 1);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Registration failed";
        setServerError(message);
        setShakeKey((prev) => prev + 1);
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

  const SectionDivider = ({ label, color }: { label: string; color: string }) => (
    <motion.div variants={formItemVariants} className="pt-2">
      <div className="flex items-center gap-2 mb-3">
        <div
          className="h-px flex-1"
          style={{
            background: `linear-gradient(90deg, ${color}30, transparent)`,
          }}
        />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div
          className="h-px flex-1"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}30)`,
          }}
        />
      </div>
    </motion.div>
  );

  return (
    <section className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 lg:p-8 bg-linear-to-br from-background via-background to-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-xl lg:max-w-6xl mx-auto"
      >
        <div className="overflow-hidden rounded-2xl shadow-2xl border border-border/40 flex flex-col lg:flex-row bg-card dark:bg-card/95">
          {/* ═══════════════════════════════════════════
              LEFT PANEL
              ═══════════════════════════════════════════ */}
          <div
            className="hidden lg:flex lg:w-[42%] relative overflow-hidden flex-col items-center justify-center p-8 xl:p-10 text-white"
            style={{
              background: `linear-gradient(160deg, ${BRAND.purple} 0%, ${BRAND.teal} 100%)`,
            }}
          >
            {/* Glowing orbs */}
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

            {/* Dot grid */}
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
              className="relative z-10 space-y-6 w-full max-w-sm"
            >
              {/* Logo */}
              <motion.div variants={panelItemVariants} className="flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 ring-1 ring-white/10">
                  <GraduationCap className="size-12 text-white" />
                </div>
              </motion.div>

              {/* Title */}
              <motion.div variants={panelItemVariants} className="text-center space-y-2">
                <h2 className="text-2xl xl:text-3xl font-bold tracking-tight">
                  Empower Your University
                </h2>
                <p className="text-white/70 text-sm leading-relaxed">
                  Join leading institutions using ScholarSync to manage scholarships
                  efficiently
                </p>
              </motion.div>

              {/* Features */}
              <motion.div variants={panelItemVariants}>
                <div className="space-y-3">
                  {features.map((feature) => (
                    <div
                      key={feature.title}
                      className="flex items-start gap-3 bg-white/6 backdrop-blur-sm rounded-xl p-3.5 ring-1 ring-white/8"
                    >
                      <div className="shrink-0 mt-0.5 bg-white/10 rounded-lg p-2">
                        <feature.icon className="size-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-tight">
                          {feature.title}
                        </p>
                        <p className="text-xs text-white/60 mt-0.5 leading-snug">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Divider */}
              <motion.div variants={panelItemVariants}>
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-medium">
                    How it works
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
              </motion.div>

              {/* Steps */}
              <motion.div variants={panelItemVariants}>
                <div className="grid grid-cols-2 gap-2.5">
                  {steps.map((step) => (
                    <div
                      key={step.number}
                      className="flex items-center gap-2.5 bg-white/5 rounded-lg px-3.5 py-2.5 ring-1 ring-white/6"
                    >
                      <span
                        className="text-xl font-bold leading-none"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.3))",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {step.number}
                      </span>
                      <span className="text-xs text-white/60 leading-tight">
                        {step.text}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Trust badge */}
              <motion.div variants={panelItemVariants} className="text-center pt-1">
                <div className="inline-flex items-center gap-2 bg-white/6 rounded-full px-5 py-2 ring-1 ring-white/8">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="size-6 rounded-full ring-2 ring-white/10"
                        style={{
                          background: `linear-gradient(135deg, ${
                            i % 2 === 0
                              ? "rgba(255,255,255,0.25)"
                              : "rgba(255,255,255,0.15)"
                          }, rgba(255,255,255,0.05))`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-white/60 font-medium">
                    Trusted by 50+ universities
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* ═══════════════════════════════════════════
              RIGHT PANEL — Form (One field per line)
              ═══════════════════════════════════════════ */}
          <div className="flex-1 flex flex-col">
            <div
              className="h-1 lg:hidden"
              style={{
                background: `linear-gradient(90deg, ${BRAND.purple}, ${BRAND.teal})`,
              }}
            />

            <div className="flex-1 flex flex-col justify-center p-5 sm:p-7 lg:p-8 overflow-y-auto">
              {/* Mobile logo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
                className="flex justify-center mb-4 lg:hidden"
              >
                <Image
                  src="/logo.png"
                  alt="ScholarSync"
                  width={200}
                  height={80}
                  className="h-14 w-auto object-contain"
                  priority
                />
              </motion.div>

              {/* Heading */}
              <div className="text-center lg:text-left mb-4">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Register Your University
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Create an admin account and set up your institution
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
                  className="space-y-3"
                >
                  <SectionDivider label="Personal Information" color={BRAND.purple} />

                  {/* Full Name */}
                  <motion.div variants={formItemVariants}>
                    <form.Field
                      name="name"
                      validators={{
                        onChange: adminRegisterFieldSchemas.name,
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

                  {/* Email */}
                  <motion.div variants={formItemVariants}>
                    <form.Field
                      name="email"
                      validators={{
                        onChange: adminRegisterFieldSchemas.email,
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

                  {/* Row: Password + Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <motion.div variants={formItemVariants}>
                      <form.Field
                        name="password"
                        validators={{
                          onChange: adminRegisterFieldSchemas.password,
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

                  <SectionDivider label="University Information" color={BRAND.teal} />

                  {/* University Name */}
                  <motion.div variants={formItemVariants}>
                    <form.Field
                      name="universityName"
                      validators={{
                        onChange: adminRegisterFieldSchemas.universityName,
                      }}
                    >
                      {(field) => (
                        <AppField
                          field={field}
                          label="University Name"
                          type="text"
                          placeholder="Enter university name"
                        />
                      )}
                    </form.Field>
                  </motion.div>

                  {/* Phone */}
                  <motion.div variants={formItemVariants}>
                    <form.Field
                      name="phone"
                      validators={{
                        onChange: adminRegisterFieldSchemas.phone,
                      }}
                    >
                      {(field) => (
                        <AppField
                          field={field}
                          label="Contact Number"
                          type="text"
                          placeholder="Enter phone number"
                        />
                      )}
                    </form.Field>
                  </motion.div>

                  {/* Website */}
                  <motion.div variants={formItemVariants}>
                    <form.Field
                      name="website"
                      validators={{
                        onChange: adminRegisterFieldSchemas.website,
                      }}
                    >
                      {(field) => (
                        <AppField
                          field={field}
                          label="Website (optional)"
                          type="text"
                          placeholder="https://university.edu"
                        />
                      )}
                    </form.Field>
                  </motion.div>

                  {/* Designation */}
                  <motion.div variants={formItemVariants}>
                    <form.Field
                      name="designation"
                      validators={{
                        onChange: adminRegisterFieldSchemas.designation,
                      }}
                    >
                      {(field) => (
                        <AppField
                          field={field}
                          label="Designation (optional)"
                          type="text"
                          placeholder="e.g. Registrar, Director"
                        />
                      )}
                    </form.Field>
                  </motion.div>

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
                  <motion.div variants={formItemVariants} className="pt-1">
                    <form.Subscribe
                      selector={(s) => [s.canSubmit, s.isSubmitting] as const}
                    >
                      {([canSubmit, isSubmitting]) => (
                        <AppSubmitButton
                          isPending={isSubmitting || isPending}
                          pendingLabel="Registering university..."
                          disabled={!canSubmit}
                          className="text-white font-semibold shadow-lg hover:shadow-xl hover:opacity-90"
                          style={{
                            background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                          }}
                        >
                          Register University
                        </AppSubmitButton>
                      )}
                    </form.Subscribe>
                  </motion.div>
                </form>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="mt-4 space-y-2"
              >
                <div className="rounded-lg border border-dashed p-2 text-center border-[#0097b240] dark:border-[#0097b270]">
                  <p className="text-sm text-muted-foreground">
                    Are you a student?{" "}
                    <Link
                      href="/register"
                      className="font-semibold underline-offset-4 hover:underline transition-all"
                      style={{ color: BRAND.teal }}
                    >
                      Register as student →
                    </Link>
                  </p>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold underline-offset-4 hover:underline transition-all"
                    style={{ color: BRAND.purple }}
                  >
                    Log in
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AdminRegisterForm;
