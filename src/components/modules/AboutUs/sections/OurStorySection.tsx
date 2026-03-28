"use client";

import { motion } from "framer-motion";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const timeline = [
  {
    year: "Early March 2026",
    title: "The Concept & Architecture",
    description:
      "Recognized the heavy friction in traditional scholarship systems. Sketched the initial database schema, defined the complex multi-role architecture (Admin, Reviewer, Student), and selected a modern Next.js tech stack.",
  },
  {
    year: "Mid March 2026",
    title: "Core Infrastructure & Security",
    description:
      "Developed the robust backend foundation. Engineered secure JWT authentication, strict role-based access control (RBAC) middleware, and the core API routes to handle universities and applications.",
  },
  {
    year: "Late March 2026",
    title: "Premium UI & Experience",
    description:
      "Transformed the frontend into a world-class SaaS experience. Built glassmorphic dashboards, integrated fluid Framer Motion animations, and designed intuitive, highly responsive application workflows.",
  },
  {
    year: "Present & Future",
    title: "Refinement & Deployment",
    description:
      "Conducting end-to-end testing, optimizing complex database queries for sub-second load times, and preparing ScholarTrack for a full-scale deployment to revolutionize education funding.",
  },
];

export function OurStorySection() {
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
            style={{ background: `${BRAND.purple}15`, color: BRAND.purple }}
          >
            Our Journey
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            How we got{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.teal}, ${BRAND.purple})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              here
            </span>
          </h2>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-5.75 top-0 h-full w-0.5 md:left-1/2 md:-translate-x-px"
              style={{
                background: `linear-gradient(180deg, ${BRAND.purple}30, ${BRAND.teal}30)`,
              }}
            />

            <div className="space-y-12">
              {timeline.map((entry, index) => (
                <motion.div
                  key={entry.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } items-start gap-6 md:gap-10`}
                >
                  {/* Dot */}
                  <div className="absolute left-3.75 top-1 z-10 md:left-1/2 md:-translate-x-1/2">
                    <div
                      className="h-4 w-4 rounded-full shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div
                    className={`ml-12 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"
                    }`}
                  >
                    <span
                      className="mb-1 inline-block text-sm font-bold"
                      style={{ color: BRAND.teal }}
                    >
                      {entry.year}
                    </span>
                    <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                      {entry.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {entry.description}
                    </p>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
