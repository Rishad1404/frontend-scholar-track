"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  Star,
  Brain,
  Bell,
  TrendingUp,
  Users,
  Award,
  DollarSign,
  Shield,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const rightContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.6 },
  },
};

const cardItem = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 200, damping: 20 },
  },
};

const trustItems = [
  "Automated Screening",
  "Real-time Tracking",
  "Secure Documents",
  "Transparent Reviews",
];

const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${(i * 9.5 + 3) % 100}%`,
  top: `${(i * 8.2 + 8) % 100}%`,
  duration: 3.5 + (i % 4) * 0.7,
  delay: (i % 5) * 0.5,
  color: i % 2 === 0 ? BRAND.teal : BRAND.purple,
}));

// Status flow steps
const statusSteps = [
  { label: "Draft", active: true, done: true },
  { label: "Submitted", active: true, done: true },
  { label: "Screening", active: true, done: true },
  { label: "Review", active: true, done: false },
  { label: "Approved", active: false, done: false },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
      {/* Floating Dots */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0], scale: [0.5, 1, 0.5] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
          }}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            left: p.left,
            top: p.top,
            backgroundColor: p.color,
          }}
        />
      ))}

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-12 xl:gap-20">
          {/* ──────────────── LEFT SIDE ──────────────── */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="flex-1 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={item} className="mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-4 py-2"
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.teal}, ${BRAND.purple})`,
                  }}
                >
                  <Sparkles className="h-3 w-3 text-white" />
                </span>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                  Now with AI-Powered Evaluation
                </span>
                <div
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: BRAND.teal }}
                />
              </motion.div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={item}
              className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl"
            >
              <span className="text-gray-900 dark:text-white">
                Scholarship
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Management{" "}
              </span>
              <span
                className="inline-block"
                style={{
                  background: `linear-gradient(135deg, ${BRAND.purple} 0%, ${BRAND.teal} 50%, ${BRAND.purple} 100%)`,
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "shimmer 4s ease-in-out infinite",
                }}
              >
                Reimagined
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={item}
              className="mt-6 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg mx-auto lg:mx-0"
            >
              The complete platform for universities to create, manage, and
              disburse scholarships — and for students to discover, apply,
              and track seamlessly.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={item}
              className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start"
            >
              <Link href="/register">
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    size="lg"
                    className="group relative h-13 cursor-pointer gap-2 overflow-hidden rounded-2xl px-8 text-base font-semibold text-white shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                    }}
                  >
                    <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    <GraduationCap className="h-5 w-5" />
                    Apply as Student
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </Link>

              <Link href="/register-admin">
                <motion.div
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-13 cursor-pointer gap-2 rounded-2xl border-2 px-8 text-base font-semibold"
                  >
                    <Building2 className="h-5 w-5" />
                    Register University
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Trust Row */}
            <motion.div
              variants={item}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start"
            >
              {trustItems.map((text) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0097b2] dark:text-teal-400" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ──────────────── RIGHT SIDE ──────────────── */}
          <motion.div
            variants={rightContainer}
            initial="hidden"
            animate="visible"
            className="relative flex-1 hidden lg:flex items-center justify-center min-h-130"
          >
            {/* ── Main Scholarship Card ── */}
            <motion.div
              variants={cardItem}
              animate={{ y: [0, -8, 0] }}
              transition={{
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute top-4 left-4 xl:left-8 z-20 w-72 rounded-2xl border border-gray-200/60 p-5 shadow-xl backdrop-blur-sm dark:border-gray-700/60"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                  }}
                >
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    Merit Scholarship
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Computer Science Dept
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    Amount
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    $5,000
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    Deadline
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    Mar 15, 2025
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    Min GPA
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    3.5
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    Applicants
                  </span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    142 / 200
                  </span>
                </div>
              </div>

              <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "71%" }}
                  transition={{ duration: 1.5, delay: 1.2, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${BRAND.purple}, ${BRAND.teal})`,
                  }}
                />
              </div>
              <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                71% quota filled
              </p>
            </motion.div>

            {/* ── Application Status Card ── */}
            <motion.div
              variants={cardItem}
              animate={{ y: [0, 6, 0] }}
              transition={{
                y: {
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                },
              }}
              className="absolute top-48 right-0 xl:right-4 z-30 w-64 rounded-2xl border border-gray-200/60 p-4 shadow-xl backdrop-blur-sm dark:border-gray-700/60"
            >
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-[#0097b2] dark:text-teal-400" />
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  Application Status
                </p>
              </div>

              <div className="flex items-center gap-1">
                {statusSteps.map((step, i) => (
                  <div key={step.label} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1 + i * 0.2 }}
                        className={`h-3 w-3 rounded-full border-2 ${
                          step.done
                            ? "border-emerald-500 bg-emerald-500"
                            : step.active
                              ? "border-[#0097b2] bg-[#0097b2] dark:border-teal-400 dark:bg-teal-400"
                              : "border-gray-300 dark:border-gray-600"
                        }`}
                      />
                      <span
                        className={`mt-1 text-[8px] font-medium ${
                          step.done
                            ? "text-emerald-600 dark:text-emerald-400"
                            : step.active
                              ? "text-[#0097b2] dark:text-teal-400"
                              : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div
                        className={`mx-0.5 mb-3 h-0.5 w-4 ${
                          step.done
                            ? "bg-emerald-500"
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-500/10 px-2.5 py-1.5 dark:bg-amber-500/20">
                <Clock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                  Under Committee Review
                </span>
              </div>
            </motion.div>

            {/* ── AI Score Card ── */}
            <motion.div
              variants={cardItem}
              animate={{ y: [0, -6, 0] }}
              transition={{
                y: {
                  duration: 3.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                },
              }}
              className="absolute bottom-12 left-8 xl:left-16 z-20 w-56 rounded-2xl border border-gray-200/60 p-4 shadow-xl backdrop-blur-sm dark:border-gray-700/60"
            >
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-[#4b2875] dark:text-purple-400" />
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  AI Evaluation
                </p>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-2xl font-extrabold text-[#0097b2] dark:text-teal-300">
                    87
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    Overall Score
                  </p>
                </div>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(${BRAND.teal} 87%, transparent 0)`,
                  }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-gray-900">
                    <Star className="h-4 w-4 text-[#0097b2] dark:text-teal-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { label: "GPA Match", value: 92, color: "#10b981" },
                  { label: "Essay Quality", value: 85, color: BRAND.teal },
                  { label: "Financial Need", value: 78, color: BRAND.purple },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-gray-500 dark:text-gray-400">
                        {metric.label}
                      </span>
                      <span className="font-bold text-gray-700 dark:text-gray-300">
                        {metric.value}%
                      </span>
                    </div>
                    <div className="h-1 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{
                          duration: 1.2,
                          delay: 1.8,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: metric.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Notification Card ── */}
            <motion.div
              variants={cardItem}
              animate={{ y: [0, 5, 0] }}
              transition={{
                y: {
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5,
                },
              }}
              className="absolute bottom-4 right-8 xl:right-12 z-10 w-60 rounded-2xl border border-gray-200/60 p-4 shadow-xl backdrop-blur-sm dark:border-gray-700/60"
            >
              <div className="flex items-center gap-2 mb-3">
                <Bell className="h-4 w-4 text-[#0097b2] dark:text-teal-400" />
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  Recent Activity
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    icon: CheckCircle2,
                    text: "Application approved",
                    time: "2m ago",
                    iconClass:
                      "text-emerald-500 dark:text-emerald-400",
                  },
                  {
                    icon: DollarSign,
                    text: "$5,000 disbursed",
                    time: "1h ago",
                    iconClass:
                      "text-[#0097b2] dark:text-teal-400",
                  },
                  {
                    icon: Star,
                    text: "New scholarship posted",
                    time: "3h ago",
                    iconClass:
                      "text-amber-500 dark:text-amber-400",
                  },
                ].map((notif, i) => (
                  <motion.div
                    key={notif.text}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2 + i * 0.3 }}
                    className="flex items-start gap-2"
                  >
                    <notif.icon
                      className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${notif.iconClass}`}
                    />
                    <div className="flex-1">
                      <p className="text-[11px] font-medium text-gray-800 dark:text-gray-200">
                        {notif.text}
                      </p>
                      <p className="text-[9px] text-gray-400 dark:text-gray-500">
                        {notif.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── Mini Stats Bar ── */}
            <motion.div
              variants={cardItem}
              animate={{ y: [0, -4, 0] }}
              transition={{
                y: {
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                },
              }}
              className="absolute top-2 right-20 xl:right-28 z-10 rounded-xl border border-gray-200/60 px-4 py-2.5 shadow-lg backdrop-blur-sm dark:border-gray-700/60"
            >
              <div className="flex items-center gap-4">
                {[
                  {
                    icon: Users,
                    value: "10K+",
                    iconClass: "text-[#4b2875] dark:text-purple-400",
                  },
                  {
                    icon: Award,
                    value: "500+",
                    iconClass: "text-[#0097b2] dark:text-teal-400",
                  },
                  {
                    icon: TrendingUp,
                    value: "$2M+",
                    iconClass: "text-emerald-500 dark:text-emerald-400",
                  },
                ].map((stat) => (
                  <div
                    key={stat.value}
                    className="flex items-center gap-1.5"
                  >
                    <stat.icon className={`h-3.5 w-3.5 ${stat.iconClass}`} />
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Floating Shield Badge ── */}
            <motion.div
              variants={cardItem}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{
                rotate: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="absolute top-28 right-48 xl:right-56 z-10"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${BRAND.teal}, ${BRAND.purple})`,
                }}
              >
                <Shield className="h-6 w-6" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0%,
          100% {
            background-position: 0% center;
          }
          50% {
            background-position: 200% center;
          }
        }
      `}</style>
    </section>
  );
}