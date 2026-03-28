"use client";

import { motion } from "framer-motion";
import {
  Scale,
  Zap,
  Users,
  ShieldCheck,
  Handshake,
  Rocket,
} from "lucide-react";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const values = [
  {
    icon: Scale,
    title: "Fairness & Equity",
    description:
      "Every student deserves an equal chance. Our AI-powered evaluation removes bias and ensures merit-based selection across all applications.",
    color: BRAND.purple,
  },
  {
    icon: ShieldCheck,
    title: "Transparency",
    description:
      "No black boxes. Students see their application status in real-time, and universities get full audit trails for every decision made.",
    color: BRAND.teal,
  },
  {
    icon: Zap,
    title: "Efficiency",
    description:
      "What used to take weeks now takes days. Automated workflows, smart screening, and bulk operations save everyone time.",
    color: "#f59e0b",
  },
  {
    icon: Users,
    title: "Accessibility",
    description:
      "Built for everyone — from first-generation college students to large universities managing hundreds of scholarships simultaneously.",
    color: "#10b981",
  },
  {
    icon: Handshake,
    title: "Trust",
    description:
      "Bank-grade security, SOC2 compliance, and encrypted data storage. We protect sensitive student and institutional data at every layer.",
    color: "#8b5cf6",
  },
  {
    icon: Rocket,
    title: "Innovation",
    description:
      "Continuously improving with AI, machine learning, and modern technology to stay ahead and serve our community better.",
    color: "#ef4444",
  },
];

export function CoreValuesSection() {
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
            style={{ background: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            What Drives Us
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Our Core{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Values
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-500 dark:text-gray-400">
            The principles that guide every feature we build and every
            decision we make.
          </p>
        </motion.div>

        <div className="mx-auto max-w-6xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, index) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <motion.div
                whileHover={{ y: -4 }}
                className="group h-full rounded-2xl border border-gray-200/50 p-6 transition-shadow hover:shadow-lg dark:border-gray-800/50"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{
                    background: `${v.color}12`,
                    border: `1px solid ${v.color}20`,
                  }}
                >
                  <v.icon className="h-6 w-6" style={{ color: v.color }} />
                </div>

                <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                  {v.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {v.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}