"use client";

import { motion } from "framer-motion";
import { Heart, Users, GraduationCap } from "lucide-react";

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

const highlights = [
  { icon: Users, value: "10,000+", label: "Students Empowered" },
  { icon: GraduationCap, value: "500+", label: "Scholarships Managed" },
  { icon: Heart, value: "$2M+", label: "Funds Disbursed" },
];

export function AboutHeroSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          <motion.span
            variants={item}
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{ background: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            About ScholarTrack
          </motion.span>

          <motion.h1
            variants={item}
            className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            Making Education{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Accessible
            </span>{" "}
            for Everyone
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400"
          >
            We believe that financial barriers should never stand between a
            talented student and their education. ScholarTrack bridges the gap
            between institutions offering scholarships and students who
            deserve them.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            {highlights.map((h, index) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="text-center"
              >
                <div
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: `${BRAND.teal}12` }}
                >
                  <h.icon className="h-6 w-6" style={{ color: BRAND.teal }} />
                </div>
                <p
                  className="text-2xl font-extrabold"
                  style={{ color: BRAND.purple }}
                >
                  {h.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {h.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}