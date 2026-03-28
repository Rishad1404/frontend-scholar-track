"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Building2,
  ClipboardList,
  Star,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const roles = [
  {
    icon: ShieldCheck,
    title: "Super Admin",
    description:
      "Platform-wide oversight — manage universities, monitor subscriptions, and ensure system integrity.",
    capabilities: [
      "Approve or suspend universities",
      "View platform-wide analytics",
      "Manage subscription billing",
    ],
    iconBg: "bg-rose-500/10 dark:bg-rose-500/25",
    iconText: "text-rose-600 dark:text-rose-300",
    dotColor: "bg-rose-500",
  },
  {
    icon: Building2,
    title: "University Admin",
    description:
      "Full control over your institution — scholarships, staff, applications, and disbursements.",
    capabilities: [
      "Create & publish scholarships",
      "Add department heads & reviewers",
      "Approve applications & process payments",
    ],
    iconBg: "bg-[#4b2875]/10 dark:bg-[#4b2875]/25",
    iconText: "text-[#4b2875] dark:text-purple-300",
    dotColor: "bg-[#4b2875] dark:bg-purple-400",
  },
  {
    icon: ClipboardList,
    title: "Department Head",
    description:
      "Screen applications for your department — verify eligibility before they reach reviewers.",
    capabilities: [
      "Screen department applications",
      "Pass or reject with comments",
      "View department student data",
    ],
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/25",
    iconText: "text-emerald-600 dark:text-emerald-300",
    dotColor: "bg-emerald-500",
  },
  {
    icon: Star,
    title: "Committee Reviewer",
    description:
      "Score applications with a structured rubric — GPA, essay quality, financial need, and criteria fit.",
    capabilities: [
      "Score across 4 categories",
      "Add detailed review notes",
      "University-wide review access",
    ],
    iconBg: "bg-amber-500/10 dark:bg-amber-500/25",
    iconText: "text-amber-600 dark:text-amber-300",
    dotColor: "bg-amber-500",
  },
  {
    icon: GraduationCap,
    title: "Student",
    description:
      "Discover scholarships, submit applications, upload documents, and track your journey to funding.",
    capabilities: [
      "Browse & apply to scholarships",
      "Upload required documents",
      "Track status in real-time",
    ],
    iconBg: "bg-[#0097b2]/10 dark:bg-[#0097b2]/25",
    iconText: "text-[#0097b2] dark:text-teal-300",
    dotColor: "bg-[#0097b2] dark:bg-teal-400",
  },
];

export function RolesOverviewSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <span className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#4b2875]/10 text-[#4b2875] dark:bg-[#4b2875]/25 dark:text-purple-300">
            Built for Every Role
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            One platform,{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              five tailored experiences
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-500 dark:text-gray-400">
            Each role gets a dedicated dashboard, permissions, and workflow
            designed for their specific responsibilities in the scholarship
            lifecycle.
          </p>
        </motion.div>

        {/* Top row: 3 cards */}
        <div className="mx-auto max-w-6xl grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {roles.slice(0, 3).map((role, index) => (
            <RoleCard key={role.title} role={role} index={index} />
          ))}
        </div>

        {/* Bottom row: 2 cards centered */}
        <div className="mx-auto max-w-6xl mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-2 lg:max-w-4xl">
          {roles.slice(3).map((role, index) => (
            <RoleCard key={role.title} role={role} index={index + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RoleCard({
  role,
  index,
}: {
  role: (typeof roles)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
        className="group h-full rounded-2xl border border-gray-200/50 p-6 transition-shadow hover:shadow-xl dark:border-gray-800/50"
      >
        {/* Icon + Title */}
        <div className="mb-4 flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${role.iconBg}`}
          >
            <role.icon className={`h-5 w-5 ${role.iconText}`} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {role.title}
          </h3>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {role.description}
        </p>

        {/* Capabilities */}
        <ul className="space-y-2">
          {role.capabilities.map((cap) => (
            <li
              key={cap}
              className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400"
            >
              <div
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${role.dotColor}`}
              />
              <span>{cap}</span>
            </li>
          ))}
        </ul>

        {/* Learn more */}
        <div className="mt-5 flex items-center gap-1">
          <span className={`text-xs font-semibold ${role.iconText}`}>
            Learn more
          </span>
          <ArrowRight
            className={`h-3 w-3 transition-transform group-hover:translate-x-1 ${role.iconText}`}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}