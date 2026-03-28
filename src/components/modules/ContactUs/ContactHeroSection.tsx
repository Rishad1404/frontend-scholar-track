"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";

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

export function ContactHeroSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={item} className="mb-6">
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: `${BRAND.teal}12` }}
            >
              <Mail className="h-7 w-7" style={{ color: BRAND.teal }} />
            </div>
          </motion.div>

          <motion.span
            variants={item}
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{ background: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            Get In Touch
          </motion.span>

          <motion.h1
            variants={item}
            className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl"
          >
            We&apos;d love to{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              hear from you
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-xl text-lg text-gray-600 dark:text-gray-400"
          >
            Have a question, partnership proposal, or need support?
            Our team typically responds within 24 hours.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}