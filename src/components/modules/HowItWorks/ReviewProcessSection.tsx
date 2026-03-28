"use client";

import { motion } from "framer-motion";
import {
  Filter,
  ClipboardCheck,
  Star,
  Brain,
  ArrowRight,
} from "lucide-react";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const reviewStages = [
  {
    icon: Filter,
    role: "Department Head",
    title: "Application Screening",
    color: "#10b981",
    roleBg: "bg-emerald-500/10 dark:bg-emerald-500/25",
    roleText: "text-emerald-600 dark:text-emerald-300",
    arrowText: "text-emerald-500 dark:text-emerald-400",
    description:
      "Department heads perform initial screening for applications tied to their department. They verify basic eligibility and pass or reject applications.",
    actions: [
      "View applications assigned to their department",
      "Check student academic info and documents",
      "Pass or reject with a written comment",
      "University-wide scholarships skip this step entirely",
    ],
  },
  {
    icon: Brain,
    role: "AI System",
    title: "AI Evaluation",
    color: BRAND.teal,
    roleBg: "bg-[#0097b2]/10 dark:bg-[#0097b2]/25",
    roleText: "text-[#0097b2] dark:text-teal-300",
    arrowText: "text-[#0097b2] dark:text-teal-400",
    description:
      "Our AI analyzes the application holistically — evaluating eligibility, essay quality, financial need, and overall merit to generate an objective score.",
    actions: [
      "Eligibility check against scholarship criteria",
      "Essay quality and coherence scoring",
      "Financial need assessment from provided data",
      "Overall AI score with detailed reasoning summary",
    ],
  },
  {
    icon: Star,
    role: "Committee Reviewer",
    title: "Human Review & Scoring",
    color: "#f59e0b",
    roleBg: "bg-amber-500/10 dark:bg-amber-500/25",
    roleText: "text-amber-600 dark:text-amber-300",
    arrowText: "text-amber-500 dark:text-amber-400",
    description:
      "University-wide reviewers evaluate applications with a structured scoring rubric covering GPA, essay, financial need, and custom criteria.",
    actions: [
      "Score across 4 categories: GPA, Essay, Financial, Criteria",
      "Total score auto-calculated from category weights",
      "Add detailed notes and observations",
      "One reviewer per application (unique constraint)",
    ],
  },
  {
    icon: ClipboardCheck,
    role: "University Admin",
    title: "Final Decision",
    color: BRAND.purple,
    roleBg: "bg-[#4b2875]/10 dark:bg-[#4b2875]/25",
    roleText: "text-[#4b2875] dark:text-purple-300",
    arrowText: "text-[#4b2875] dark:text-purple-400",
    description:
      "Admin reviews all scores — AI evaluation, screening result, and reviewer scores — then makes the final approval or rejection decision.",
    actions: [
      "View complete application with all scores",
      "Compare AI score vs human review scores",
      "Approve → status becomes APPROVED",
      "Reject → status becomes REJECTED with reason",
    ],
  },
];

export function ReviewProcessSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <span className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider bg-[#0097b2]/10 text-[#0097b2] dark:bg-[#0097b2]/25 dark:text-teal-300">
            Review Pipeline
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            How applications are{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.teal}, ${BRAND.purple})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              evaluated
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-500 dark:text-gray-400">
            A multi-layered review process combining AI intelligence with human
            judgment for fair outcomes.
          </p>
        </motion.div>

        <div className="mx-auto max-w-4xl space-y-6">
          {reviewStages.map((stage, index) => (
            <motion.div
              key={stage.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
            >
              <motion.div
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-gray-200/50 p-6 transition-shadow hover:shadow-xl dark:border-gray-800/50 lg:p-8"
              >
                <div className="flex flex-col gap-6 sm:flex-row">
                  {/* Left: Icon + Role */}
                  <div className="sm:w-48 shrink-0">
                    <div
                      className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${stage.color}, ${stage.color}cc)`,
                      }}
                    >
                      <stage.icon className="h-6 w-6" />
                    </div>
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${stage.roleBg} ${stage.roleText}`}
                    >
                      {stage.role}
                    </span>
                  </div>

                  {/* Right: Content */}
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                      {stage.title}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {stage.description}
                    </p>

                    <ul className="space-y-2">
                      {stage.actions.map((action) => (
                        <li
                          key={action}
                          className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <ArrowRight
                            className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${stage.arrowText}`}
                          />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {index < reviewStages.length - 1 && (
                  <div className="mt-6 flex justify-center">
                    <div className="h-6 w-0.5 bg-gray-200 dark:bg-gray-700" />
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}