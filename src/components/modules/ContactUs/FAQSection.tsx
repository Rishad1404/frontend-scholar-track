"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const faqs = [
  {
    question: "Is ScholarTrack free for students?",
    answer:
      "Yes, ScholarTrack is completely free for students. You can create an account, complete your profile, browse scholarships, and submit applications without any cost. Our platform is funded through university subscription plans.",
  },
  {
    question: "How does the AI evaluation work?",
    answer:
      "Our AI system analyzes applications based on multiple factors including GPA, essay quality, financial need, and eligibility criteria. It provides a preliminary score and summary to assist reviewers, but final decisions are always made by human committee members.",
  },
  {
    question: "What does a university subscription include?",
    answer:
      "University subscriptions include full platform access — scholarship creation, multi-role management (admins, department heads, reviewers), AI evaluation, document management, Stripe-powered disbursements, analytics dashboards, and priority support.",
  },
  {
    question: "How secure is my data?",
    answer:
      "We use bank-grade encryption for all data at rest and in transit. Documents are stored securely with access controls, and we maintain comprehensive audit trails. We are GDPR compliant and never share personal information with third parties.",
  },
  {
    question: "Can I apply to scholarships from multiple universities?",
    answer:
      "Absolutely. You can browse scholarships from any registered university on ScholarTrack. Simply complete your profile once, and you can apply to any scholarship you're eligible for across the platform.",
  },
  {
    question: "How are disbursements processed?",
    answer:
      "Disbursements are processed through Stripe Connect. Once an application is approved by the university admin, the disbursement is created and funds are transferred directly. Students can track the status in real-time.",
  },
  {
    question: "How do I get support?",
    answer:
      "Students can reach us via email at support@scholartrack.io. Subscribed universities get priority support with a dedicated account manager, live chat, and a priority ticket system with guaranteed response times.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center"
        >
          <HelpCircle
            className="mx-auto mb-4 h-10 w-10"
            style={{ color: `${BRAND.teal}40` }}
          />
          <span
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{ background: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            FAQ
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Frequently asked{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              questions
            </span>
          </h2>
        </motion.div>

        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="rounded-xl border border-gray-200/50 transition-shadow hover:shadow-md dark:border-gray-800/50">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <ChevronDown
                      className="h-5 w-5"
                      style={{
                        color:
                          openIndex === index ? BRAND.teal : "#9ca3af",
                      }}
                    />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5">
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          Still have questions?{" "}
          <a
            href="mailto:support@scholartrack.io"
            className="font-semibold underline underline-offset-2"
            style={{ color: BRAND.teal }}
          >
            Email our support team
          </a>
        </motion.p>
      </div>
    </section>
  );
}