"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Search,
  CheckCircle,
  CreditCard,
  ArrowDown,
} from "lucide-react";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const pipeline = [
  {
    icon: FileText,
    title: "Application",
    status: "DRAFT → SUBMITTED",
    description:
      "Student creates and submits a scholarship application with required documents.",
    color: BRAND.teal,
    badgeBg: "bg-[#0097b2]/10 dark:bg-[#0097b2]/25",
    badgeText: "text-[#0097b2] dark:text-teal-300",
    lineColor: `${BRAND.teal}30`,
  },
  {
    icon: Search,
    title: "Screening",
    status: "SCREENING",
    description:
      "Department head reviews for basic eligibility. University-wide scholarships skip this step.",
    color: BRAND.purple,
    badgeBg: "bg-[#4b2875]/10 dark:bg-[#4b2875]/25",
    badgeText: "text-[#4b2875] dark:text-purple-300",
    lineColor: `${BRAND.purple}30`,
  },
  {
    icon: CheckCircle,
    title: "Review & Decision",
    status: "UNDER_REVIEW → APPROVED / REJECTED",
    description:
      "Committee reviewers score the application. Admin makes the final approval or rejection.",
    color: "#10b981",
    badgeBg: "bg-emerald-500/10 dark:bg-emerald-500/25",
    badgeText: "text-emerald-600 dark:text-emerald-300",
    lineColor: "#10b98130",
  },
  {
    icon: CreditCard,
    title: "Disbursement",
    status: "DISBURSED",
    description:
      "Approved applications receive funding through Stripe directly to the student.",
    color: "#f59e0b",
    badgeBg: "bg-amber-500/10 dark:bg-amber-500/25",
    badgeText: "text-amber-600 dark:text-amber-300",
    lineColor: "#f59e0b30",
  },
];

export function OverviewSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <span className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#0097b2]/10 text-[#0097b2] dark:bg-[#0097b2]/25 dark:text-teal-300">
            The Pipeline
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Application{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              lifecycle
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-500 dark:text-gray-400">
            Every application flows through a structured pipeline ensuring
            fairness, transparency, and efficiency.
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          {pipeline.map((stage, index) => (
            <motion.div
              key={stage.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <div className="flex gap-6">
                {/* Left line + icon */}
                <div className="flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${stage.color}, ${stage.color}cc)`,
                    }}
                  >
                    <stage.icon className="h-6 w-6" />
                  </motion.div>
                  {index < pipeline.length - 1 && (
                    <div className="my-2 flex h-16 flex-col items-center justify-center">
                      <div
                        className="h-full w-0.5"
                        style={{ background: stage.lineColor }}
                      />
                      <ArrowDown
                        className="my-1 h-4 w-4 text-gray-300 dark:text-gray-600"
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="pb-10">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {stage.title}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${stage.badgeBg} ${stage.badgeText}`}
                    >
                      {stage.status}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                    {stage.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}