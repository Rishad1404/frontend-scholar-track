"use client";

import { motion } from "framer-motion";
import {
  Users,
  Workflow,
  Brain,
  CreditCard,
  ShieldCheck,
  Bell,
} from "lucide-react";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const highlights = [
  {
    icon: Users,
    title: "5 User Roles",
    description: "Super Admin, University Admin, Department Head, Reviewer & Student",
    iconBg: "bg-[#4b2875]/10 dark:bg-[#4b2875]/25",
    iconText: "text-[#4b2875] dark:text-purple-300",
  },
  {
    icon: Workflow,
    title: "6-Stage Pipeline",
    description: "Draft → Submitted → Screening → Review → Approved → Disbursed",
    iconBg: "bg-[#0097b2]/10 dark:bg-[#0097b2]/25",
    iconText: "text-[#0097b2] dark:text-teal-300",
  },
  {
    icon: Brain,
    title: "AI Evaluation",
    description: "Automated eligibility check, essay scoring & financial need analysis",
    iconBg: "bg-amber-500/10 dark:bg-amber-500/25",
    iconText: "text-amber-600 dark:text-amber-300",
  },
  {
    icon: CreditCard,
    title: "Stripe Payments",
    description: "Subscription billing for universities & direct disbursement to students",
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/25",
    iconText: "text-emerald-600 dark:text-emerald-300",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Design",
    description: "Role-based access, encrypted documents & complete audit trails",
    iconBg: "bg-blue-500/10 dark:bg-blue-500/25",
    iconText: "text-blue-600 dark:text-blue-300",
  },
  {
    icon: Bell,
    title: "Real-time Alerts",
    description: "Instant notifications for every status change & important update",
    iconBg: "bg-rose-500/10 dark:bg-rose-500/25",
    iconText: "text-rose-600 dark:text-rose-300",
  },
];

export function PlatformHighlightsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#0097b2]/10 text-[#0097b2] dark:bg-[#0097b2]/25 dark:text-teal-300">
            Platform Overview
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Built for{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              real workflows
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-500 dark:text-gray-400">
            Every feature maps to an actual step in the scholarship lifecycle
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((h, index) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group flex items-start gap-4 rounded-2xl border border-gray-200/50 p-5 transition-shadow hover:shadow-lg dark:border-gray-800/50"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${h.iconBg}`}
                  >
                    <h.icon className={`h-5 w-5 ${h.iconText}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      {h.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                      {h.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}