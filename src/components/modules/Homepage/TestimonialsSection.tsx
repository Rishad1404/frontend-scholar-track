"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Student, Harvard University",
    content:
      "ScholarTrack made finding and applying for scholarships incredibly easy. The AI evaluation gave me confidence that my application was competitive.",
    rating: 5,
    initials: "SM",
  },
  {
    name: "Dr. James Chen",
    role: "Dean, MIT Engineering",
    content:
      "Our scholarship workflow improved by 40%. The automated screening saves our team dozens of hours every application cycle.",
    rating: 5,
    initials: "JC",
  },
  {
    name: "Emily Rodriguez",
    role: "Admin, Stanford University",
    content:
      "The dashboard analytics help us make data-driven decisions. Best investment for student financial aid operations.",
    rating: 5,
    initials: "ER",
  },
  {
    name: "Michael Park",
    role: "Student, Oxford University",
    content:
      "The transparency is amazing. I could see exactly where my application stood at every stage of the review process.",
    rating: 5,
    initials: "MP",
  },
  {
    name: "Priya Sharma",
    role: "Reviewer, IIT Bombay",
    content:
      "The scoring interface is intuitive and fair. I can evaluate applications efficiently without any confusion or bias.",
    rating: 5,
    initials: "PS",
  },
  {
    name: "David Thompson",
    role: "Dept Head, Cambridge",
    content:
      "Screening applications used to take weeks. Now it takes days. The ROI on ScholarTrack is undeniable for our department.",
    rating: 5,
    initials: "DT",
  },
];

export function TestimonialsSection() {
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
          <Quote className="mx-auto mb-4 h-10 w-10 text-gray-300 dark:text-gray-700" />
          <span
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
            style={{
              background: `${BRAND.teal}15`,
              color: BRAND.teal,
            }}
          >
            Testimonials
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Loved by{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              thousands worldwide
            </span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="mx-auto max-w-6xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <motion.div
                whileHover={{ y: -4 }}
                className="h-full rounded-2xl border border-gray-200/50 p-6 backdrop-blur-sm transition-shadow hover:shadow-lg dark:border-gray-800/50"
              >
                {/* Stars */}
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="mb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-300 italic">
                  &ldquo;{t.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 border-t border-gray-200/50 pt-4 dark:border-gray-800/50">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}