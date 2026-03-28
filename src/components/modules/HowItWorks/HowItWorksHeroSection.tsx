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
  {
    label: "Students",
    bg: "bg-[#0097b2]/15 dark:bg-[#0097b2]/25",
    text: "text-[#0097b2] dark:text-teal-300",
  },
  {
    label: "University Admins",
    bg: "bg-[#4b2875]/15 dark:bg-[#4b2875]/25",
    text: "text-[#4b2875] dark:text-purple-300",
  },
  {
    label: "Department Heads",
    bg: "bg-emerald-500/15 dark:bg-emerald-500/25",
    text: "text-emerald-600 dark:text-emerald-300",
  },
  {
    label: "Reviewers",
    bg: "bg-amber-500/15 dark:bg-amber-500/25",
    text: "text-amber-600 dark:text-amber-300",
  },
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
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4b2875]/10 dark:bg-[#4b2875]/25">
              <Workflow className="h-7 w-7 text-[#4b2875] dark:text-purple-300" />
            </div>
          </motion.div>

          <motion.span
            variants={item}
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#4b2875]/10 text-[#4b2875] dark:bg-[#4b2875]/25 dark:text-purple-300"
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
                className={`rounded-full px-4 py-1.5 text-xs font-semibold ${role.bg} ${role.text}`}
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