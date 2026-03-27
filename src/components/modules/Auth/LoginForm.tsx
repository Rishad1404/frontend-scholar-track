"use client";

import { loginAction } from "@/app/(commonLayout)/(auth)/login/_actions";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion, easeOut } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// ─── Brand Colors ───
const BRAND = {
  teal: "#0097b2",
  purple: "#4b2875",
};

// ─── Floating Background Elements ───
const floatingOrbs = [
  {
    size: "w-72 h-72",
    left: "5%",
    top: "10%",
    color: BRAND.teal,
    duration: 20,
    delay: 0,
  },
  {
    size: "w-96 h-96",
    left: "70%",
    top: "55%",
    color: BRAND.purple,
    duration: 25,
    delay: 3,
  },
  {
    size: "w-64 h-64",
    left: "75%",
    top: "5%",
    color: BRAND.teal,
    duration: 22,
    delay: 1,
  },
  {
    size: "w-80 h-80",
    left: "10%",
    top: "65%",
    color: BRAND.purple,
    duration: 28,
    delay: 5,
  },
];

const floatingDots = [
  { size: "w-3 h-3", left: "15%", top: "25%", color: BRAND.teal, duration: 15, delay: 0 },
  {
    size: "w-2 h-2",
    left: "55%",
    top: "20%",
    color: BRAND.purple,
    duration: 18,
    delay: 2,
  },
  { size: "w-4 h-4", left: "85%", top: "40%", color: BRAND.teal, duration: 12, delay: 4 },
  {
    size: "w-2 h-2",
    left: "35%",
    top: "75%",
    color: BRAND.purple,
    duration: 16,
    delay: 1,
  },
  { size: "w-3 h-3", left: "90%", top: "80%", color: BRAND.teal, duration: 14, delay: 3 },
  {
    size: "w-2 h-2",
    left: "45%",
    top: "10%",
    color: BRAND.purple,
    duration: 20,
    delay: 6,
  },
];

// ─── Animation Variants ───
const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
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

// ─── Component ───
interface LoginFormProps {
  redirectPath?: string;
}

const LoginForm = ({ redirectPath }: LoginFormProps) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectPath),
  });

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = (await mutateAsync(value)) as any;
        if (!result.success) {
          setServerError(result.message || "Login failed");
          setShakeKey((prev) => prev + 1);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Login failed";
        setServerError(message);
        setShakeKey((prev) => prev + 1);
      }
    },
  });

  return (
    <section className="relative flex items-center justify-center overflow-hidden px-4 py-16 min-h-[calc(100vh-4rem)]">
      {/* ═══ Animated Background ═══ */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${BRAND.teal}08 0%, transparent 40%, transparent 60%, ${BRAND.purple}08 100%)`,
          }}
        />

        {/* Large floating orbs */}
        {floatingOrbs.map((orb, i) => (
          <motion.div
            key={`orb-${i}`}
            className={`absolute rounded-full ${orb.size} blur-3xl`}
            style={{
              left: orb.left,
              top: orb.top,
              backgroundColor: orb.color,
              opacity: 0.06,
            }}
            animate={{
              y: [0, -30, 0, 30, 0],
              x: [0, 20, 0, -20, 0],
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

        {/* Small floating dots */}
        {floatingDots.map((dot, i) => (
          <motion.div
            key={`dot-${i}`}
            className={`absolute rounded-full ${dot.size} blur-sm`}
            style={{
              left: dot.left,
              top: dot.top,
              backgroundColor: dot.color,
              opacity: 0.15,
            }}
            animate={{
              y: [0, -15, 0, 15, 0],
              x: [0, 8, 0, -8, 0],
              scale: [1, 1.3, 1, 0.8, 1],
            }}
            transition={{
              duration: dot.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: dot.delay,
            }}
          />
        ))}

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, ${BRAND.teal} 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            opacity: 0.03,
          }}
        />
      </div>

      {/* ═══ Login Card ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="shadow-xl border-border/40 backdrop-blur-sm bg-card/95">
          {/* Brand gradient top accent */}
          <div
            className="h-1 rounded-t-xl"
            style={{
              background: `linear-gradient(90deg, ${BRAND.teal}, ${BRAND.purple})`,
            }}
          />

          {/* ─── Header ─── */}
          <CardHeader className="text-center space-y-4 pt-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
              className="flex justify-center"
            >
              <Image
                src="/logo.png"
                alt="ScholarSync"
                width={200}
                height={80}
                className="h-20 w-auto object-contain"
                priority
              />
            </motion.div>

            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Welcome Back!
              </CardTitle>
              <CardDescription className="mt-1">
                Please enter your credentials to log in
              </CardDescription>
            </div>
          </CardHeader>

          {/* ─── Form ─── */}
          <CardContent>
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
                <div className="space-y-4">
                  {/* Email */}
                  <motion.div variants={formItemVariants}>
                    <form.Field
                      name="email"
                      validators={{ onChange: loginZodSchema.shape.email }}
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

                  {/* Password */}
                  <motion.div variants={formItemVariants}>
                    <form.Field
                      name="password"
                      validators={{ onChange: loginZodSchema.shape.password }}
                    >
                      {(field) => (
                        <div className="space-y-1">
                          <AppField
                            field={field}
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            append={
                              <Button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                variant="ghost"
                                size="icon"
                                className="hover:bg-transparent h-auto w-auto cursor-pointer"
                                aria-label={
                                  showPassword ? "Hide password" : "Show password"
                                }
                              >
                                <motion.div
                                  key={showPassword ? "hide" : "show"}
                                  initial={{ rotateY: 90, opacity: 0 }}
                                  animate={{ rotateY: 0, opacity: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {showPassword ? (
                                    <EyeOff
                                      className="size-4 text-muted-foreground"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <Eye
                                      className="size-4 text-muted-foreground"
                                      aria-hidden="true"
                                    />
                                  )}
                                </motion.div>
                              </Button>
                            }
                          />
                          <div className="text-right">
                            <Link
                              href="/forgot-password"
                              className="text-sm font-medium hover:underline underline-offset-4 transition-all"
                              style={{ color: BRAND.teal }}
                            >
                              Forgot password?
                            </Link>
                          </div>
                        </div>
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
                        pendingLabel="Logging in..."
                        disabled={!canSubmit}
                        className="text-white font-semibold shadow-lg hover:shadow-xl hover:opacity-90"
                        style={{
                          background: `linear-gradient(135deg, ${BRAND.teal}, ${BRAND.purple})`,
                        }}
                      >
                        Log In
                      </AppSubmitButton>
                    )}
                  </form.Subscribe>
                </motion.div>
              </form>
            </motion.div>

            {/* ─── Divider + Google ─── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5, ease: "easeOut" }}
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
                Sign in with Google
              </Button>
            </motion.div>
          </CardContent>

          {/* ─── Footer ─── */}
          <CardFooter className="justify-center border-t border-border/40 pt-6 pb-6">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold underline-offset-4 hover:underline transition-all"
                style={{ color: BRAND.purple }}
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </section>
  );
};

export default LoginForm;
