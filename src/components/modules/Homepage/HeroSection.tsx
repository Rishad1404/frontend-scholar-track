"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
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

const trustItems = [
  "Automated Screening",
  "Real-time Tracking",
  "Secure Documents",
  "Transparent Reviews",
];

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${(i * 8.3 + 5) % 100}%`,
  top: `${(i * 7.7 + 10) % 100}%`,
  duration: 3 + (i % 4) * 0.8,
  delay: (i % 5) * 0.6,
  color: i % 2 === 0 ? BRAND.teal : BRAND.purple,
}));

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
      {/* Floating Dots */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.4, 0],
            scale: [0.5, 1, 0.5],
          }}
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
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-5xl text-center"
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
            className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="text-gray-900 dark:text-white">
              Scholarship Management
            </span>
            <br />
            <span
              className="inline-block mt-2"
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
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg md:text-xl"
          >
            The complete platform for universities to create, manage, and
            disburse scholarships — and for students to discover, apply, and
            track their applications seamlessly.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
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
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
          >
            {trustItems.map((text) => (
              <div
                key={text}
                className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              >
                <CheckCircle2
                  className="h-4 w-4 shrink-0"
                  style={{ color: BRAND.teal }}
                />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
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