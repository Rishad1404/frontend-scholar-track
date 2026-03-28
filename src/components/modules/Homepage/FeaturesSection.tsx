"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  TrendingUp,
  Lock,
  BarChart3,
  Bell,
  ArrowRight,
} from "lucide-react";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const features = [
  {
    icon: Zap,
    title: "AI-Powered Evaluation",
    description:
      "Smart scoring algorithms analyze applications for fair, objective, and fast decisions.",
    details: [
      "Automated essay scoring",
      "Eligibility matching",
      "Financial need assessment",
    ],
    color: BRAND.teal,
  },
  {
    icon: Shield,
    title: "Multi-Role Access",
    description:
      "Admins, department heads, reviewers, and students — each with tailored experiences.",
    details: [
      "Role-based dashboards",
      "Granular permissions",
      "Invite-based onboarding",
    ],
    color: BRAND.purple,
  },
  {
    icon: TrendingUp,
    title: "End-to-End Tracking",
    description:
      "Follow every application from draft to disbursement with real-time status updates.",
    details: [
      "Live status timeline",
      "Document tracking",
      "Disbursement history",
    ],
    color: "#10b981",
  },
  {
    icon: Lock,
    title: "Secure & Private",
    description:
      "Bank-grade encryption protects sensitive student and financial data at every layer.",
    details: [
      "End-to-end encryption",
      "Secure file storage",
      "Audit trails",
    ],
    color: "#8b5cf6",
  },
  {
    icon: BarChart3,
    title: "Rich Analytics",
    description:
      "Comprehensive dashboards with charts, reports, and exportable data insights.",
    details: [
      "Application trends",
      "Disbursement reports",
      "Performance metrics",
    ],
    color: "#f59e0b",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Never miss an update with in-app alerts for every important event in the pipeline.",
    details: [
      "Status change alerts",
      "Deadline reminders",
      "Review assignments",
    ],
    color: "#ef4444",
  },
];

export function FeaturesSection() {
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
              background: `${BRAND.teal}15`,
              color: BRAND.teal,
            }}
          >
            Platform Features
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need to manage{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              scholarships
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-500 dark:text-gray-400">
            Built for modern scholarship administration with tools that save
            time and improve outcomes.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="mx-auto max-w-6xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative h-full rounded-2xl border border-gray-200/50 p-6 backdrop-blur-sm transition-shadow hover:shadow-xl dark:border-gray-800/50"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${feature.color}08 0%, transparent 70%)`,
                  }}
                />

                {/* Icon */}
                <div
                  className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{
                    background: `${feature.color}12`,
                    border: `1px solid ${feature.color}20`,
                  }}
                >
                  <feature.icon
                    className="h-6 w-6"
                    style={{ color: feature.color }}
                  />
                </div>

                {/* Text */}
                <h3 className="relative mb-2 text-lg font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="relative mb-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>

                {/* Detail list */}
                <ul className="relative space-y-1.5">
                  {feature.details.map((d) => (
                    <li
                      key={d}
                      className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                    >
                      <div
                        className="h-1 w-1 rounded-full"
                        style={{ background: feature.color }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>

                {/* Link */}
                <div className="relative mt-5 flex items-center gap-1">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: feature.color }}
                  >
                    Learn more
                  </span>
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    style={{ color: feature.color }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}