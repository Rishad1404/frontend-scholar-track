"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  ClipboardCheck,
  Search,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const steps = [
  {
    step: "01",
    title: "Create Account",
    description:
      "Sign up as a student or register your university as an admin in under 2 minutes.",
    icon: UserPlus,
    details: [
      "Email or Google sign-up",
      "Instant verification",
      "Secure authentication",
    ],
  },
  {
    step: "02",
    title: "Complete Profile",
    description:
      "Add your academic details including department, GPA, and upload required documents.",
    icon: ClipboardCheck,
    details: [
      "Academic information",
      "Document uploads",
      "University linking",
    ],
  },
  {
    step: "03",
    title: "Browse & Apply",
    description:
      "Discover scholarships matched to your profile and submit applications with one click.",
    icon: Search,
    details: [
      "Smart filtering",
      "Eligibility check",
      "Draft & submit",
    ],
  },
  {
    step: "04",
    title: "Get Funded",
    description:
      "Track your application through review stages and receive disbursements directly.",
    icon: BadgeCheck,
    details: [
      "Real-time tracking",
      "Status notifications",
      "Direct disbursement",
    ],
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{
              background: `${BRAND.purple}15`,
              color: BRAND.purple,
            }}
          >
            How It Works
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Get started in{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.teal}, ${BRAND.purple})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              4 simple steps
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-500 dark:text-gray-400">
            From registration to receiving funds — we made it straightforward.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, index) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="relative"
            >
              {/* Connector (desktop only) */}
              {index < 3 && (
                <div className="absolute right-0 top-12 hidden h-0.5 w-full translate-x-1/2 lg:block">
                  <div
                    className="h-full w-full"
                    style={{
                      background: `linear-gradient(90deg, ${BRAND.teal}30, ${BRAND.purple}30)`,
                    }}
                  />
                </div>
              )}

              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative z-10 h-full rounded-2xl border border-gray-200/50 p-6 backdrop-blur-sm transition-shadow hover:shadow-xl dark:border-gray-800/50"
              >
                {/* Icon + Step number */}
                <div className="mb-5 flex items-center justify-between">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                    }}
                  >
                    <s.icon className="h-6 w-6" />
                  </motion.div>

                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.teal}, ${BRAND.purple})`,
                    }}
                  >
                    {s.step}
                  </span>
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {s.description}
                </p>

                {/* Sub details */}
                <ul className="space-y-1.5">
                  {s.details.map((d) => (
                    <li
                      key={d}
                      className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                    >
                      <ChevronRight
                        className="h-3 w-3 shrink-0"
                        style={{ color: BRAND.teal }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}