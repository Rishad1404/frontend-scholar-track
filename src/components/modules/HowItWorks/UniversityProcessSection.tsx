"use client";

import { motion } from "framer-motion";
import {
  Building2,
  Settings,
  Users,
  Award,
  BarChart3,
  CreditCard,
  ChevronRight,
} from "lucide-react";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const steps = [
  {
    step: "01",
    icon: Building2,
    title: "Register University",
    description: "Admin registers the university with details like name, website, and logo. Account is pending until approved.",
    details: [
      "University profile with branding",
      "Admin account created as owner",
      "Approval by Super Admin required",
    ],
  },
  {
    step: "02",
    icon: Settings,
    title: "Configure Platform",
    description: "Set up departments, academic levels, terms, and manage subscription for full access.",
    details: [
      "Create departments (e.g., CSE, EEE, BBA)",
      "Add academic levels (Undergrad, Masters, PhD)",
      "Configure academic terms (Fall 2024, Spring 2025)",
    ],
  },
  {
    step: "03",
    icon: Users,
    title: "Add Staff Members",
    description: "Invite or directly add department heads and committee reviewers with role-based access.",
    details: [
      "Direct add with auto-generated credentials",
      "Email invite with secure token link",
      "One dept head per department, reviewers are university-wide",
    ],
  },
  {
    step: "04",
    icon: Award,
    title: "Create Scholarships",
    description: "Build scholarship listings with criteria, deadlines, funding amounts, and required documents.",
    details: [
      "Set eligibility: min GPA, financial need, dept, level",
      "Define quota and per-student amount",
      "Attach scholarship documents (PDF)",
      "Publish when ready: Draft → Active",
    ],
  },
  {
    step: "05",
    icon: BarChart3,
    title: "Manage Applications",
    description: "Track all applications, view AI evaluations, and make final approve/reject decisions.",
    details: [
      "View all applications with status filters",
      "See AI eligibility scores and essay analysis",
      "Review committee scores and screening results",
      "Approve or reject with one click",
    ],
  },
  {
    step: "06",
    icon: CreditCard,
    title: "Process Disbursements",
    description: "Create disbursements for approved applications and process payments via Stripe.",
    details: [
      "Create disbursement linked to application",
      "Process through Stripe Connect",
      "Track status: Pending → Processing → Completed",
      "Application auto-updates to DISBURSED",
    ],
  },
];

export function UniversityProcessSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <span
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{ background: `${BRAND.purple}15`, color: BRAND.purple }}
          >
            For Universities
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Complete admin{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              workflow
            </span>
          </h2>
        </motion.div>

        <div className="mx-auto max-w-4xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, index) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group h-full rounded-2xl border border-gray-200/50 p-6 transition-shadow hover:shadow-xl dark:border-gray-800/50"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                    }}
                  >
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span
                    className="text-2xl font-extrabold"
                    style={{ color: `${BRAND.purple}25` }}
                  >
                    {s.step}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {s.description}
                </p>

                <ul className="space-y-1.5">
                  {s.details.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400"
                    >
                      <ChevronRight
                        className="mt-0.5 h-3 w-3 shrink-0"
                        style={{ color: BRAND.purple }}
                      />
                      <span>{d}</span>
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