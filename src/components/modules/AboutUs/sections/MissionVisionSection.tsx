"use client";

import { motion } from "framer-motion";
import { Target, Eye, Lightbulb } from "lucide-react";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const cards = [
  {
    icon: Target,
    title: "Our Mission",
    color: BRAND.purple,
    description:
      "To democratize access to educational funding by providing a transparent, efficient, and intelligent platform that connects deserving students with scholarship opportunities worldwide.",
    points: [
      "Eliminate financial barriers to education",
      "Streamline scholarship administration",
      "Ensure fair and unbiased evaluation",
      "Maximize the impact of every dollar disbursed",
    ],
  },
  {
    icon: Eye,
    title: "Our Vision",
    color: BRAND.teal,
    description:
      "A world where every qualified student can access the financial support they need to pursue their academic dreams, regardless of their socioeconomic background.",
    points: [
      "Global scholarship accessibility",
      "AI-driven fairness in selection",
      "Zero-friction application process",
      "Complete transparency at every stage",
    ],
  },
  {
    icon: Lightbulb,
    title: "Our Approach",
    color: "#f59e0b",
    description:
      "We combine cutting-edge technology with human oversight to create a scholarship management ecosystem that is efficient, transparent, and genuinely impactful.",
    points: [
      "Technology-first but human-centered",
      "Data-driven decision making",
      "Continuous innovation and improvement",
      "Community-focused development",
    ],
  },
];

export function MissionVisionSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
            >
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group relative h-full rounded-2xl border border-gray-200/50 p-7 transition-shadow hover:shadow-xl dark:border-gray-800/50"
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${card.color}08 0%, transparent 70%)`,
                  }}
                />

                <div
                  className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-xl"
                  style={{
                    background: `${card.color}12`,
                    border: `1px solid ${card.color}20`,
                  }}
                >
                  <card.icon
                    className="h-7 w-7"
                    style={{ color: card.color }}
                  />
                </div>

                <h3
                  className="relative mb-3 text-xl font-bold"
                  style={{ color: card.color }}
                >
                  {card.title}
                </h3>

                <p className="relative mb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {card.description}
                </p>

                <ul className="relative space-y-2">
                  {card.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <div
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: card.color }}
                      />
                      {point}
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