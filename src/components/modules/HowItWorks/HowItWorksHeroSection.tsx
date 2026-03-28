"use client";

import { motion } from "framer-motion";
import { Workflow } from "lucide-react";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const roles = [
  { label: "Students", color: BRAND.teal },
  { label: "University Admins", color: BRAND.purple },
  { label: "Department Heads", color: "#10b981" },
  { label: "Reviewers", color: "#f59e0b" },
];

export function HowItWorksHeroSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div variants={item} className="mb-6">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: `${BRAND.purple}12` }}
            >
              <Workflow
                className="h-7 w-7"
                style={{ color: BRAND.purple }}
              />
            </div>
          </motion.div>

          <motion.span
            variants={item}
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{ background: `${BRAND.purple}15`, color: BRAND.purple }}
          >
            Process Overview
          </motion.span>

          <motion.h1
            variants={item}
            className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            How{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ScholarTrack
            </span>{" "}
            Works
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-2xl text-lg text-gray-600 dark:text-gray-400"
          >
            A comprehensive look at how every role interacts with the platform
            — from application to disbursement. Designed for clarity,
            efficiency, and fairness at every stage.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            {roles.map((role) => (
              <span
                key={role.label}
                className="rounded-full px-4 py-1.5 text-xs font-semibold"
                style={{
                  background: `${role.color}12`,
                  color: role.color,
                }}
              >
                {role.label}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}