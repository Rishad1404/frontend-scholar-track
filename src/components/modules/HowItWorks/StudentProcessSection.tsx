"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  ClipboardList,
  Search,
  FileUp,
  Send,
  Bell,
  ChevronRight,
} from "lucide-react";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Create Your Account",
    description: "Sign up with email or Google OAuth. Verify your email address to activate your account.",
    details: [
      "Quick email or Google registration",
      "OTP-based email verification",
      "Secure password with bcrypt hashing",
    ],
  },
  {
    step: "02",
    icon: ClipboardList,
    title: "Complete Your Profile",
    description: "Fill in personal details and academic information in a guided two-step process.",
    details: [
      "Step 1: Personal info — name, gender, date of birth, phone, address",
      "Step 2: Academic info — university, department, GPA, CGPA, level, term",
      "Upload a profile photo",
    ],
  },
  {
    step: "03",
    icon: Search,
    title: "Browse Scholarships",
    description: "Discover available scholarships filtered by your eligibility, department, and academic level.",
    details: [
      "Filter by university, department, level",
      "See requirements: min GPA, documents needed",
      "Check deadline and funding amount",
    ],
  },
  {
    step: "04",
    icon: FileUp,
    title: "Prepare & Upload Documents",
    description: "Upload required documents like transcripts, ID, essays, and recommendation letters.",
    details: [
      "Supported types: transcript, income certificate, ID, essay, recommendation",
      "Single or bulk document upload",
      "Secure cloud storage with Cloudinary",
    ],
  },
  {
    step: "05",
    icon: Send,
    title: "Submit Application",
    description: "Review your application, add an optional essay, and submit. You can save drafts anytime.",
    details: [
      "Save as draft and return later",
      "Write a personal essay (optional per scholarship)",
      "One-click submission with confirmation",
    ],
  },
  {
    step: "06",
    icon: Bell,
    title: "Track & Receive Updates",
    description: "Monitor your application status in real-time and receive notifications at every stage.",
    details: [
      "Status: Draft → Submitted → Screening → Under Review → Approved/Rejected → Disbursed",
      "In-app and email notifications",
      "View AI evaluation scores and reviewer feedback",
    ],
  },
];

export function StudentProcessSection() {
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
            For Students
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Your journey from{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.teal}, ${BRAND.purple})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              application to funding
            </span>
          </h2>
        </motion.div>

        <div className="mx-auto max-w-4xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, index) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="group h-full rounded-2xl border border-gray-200/50 p-6 transition-shadow hover:shadow-xl dark:border-gray-800/50"
              >
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.teal}, ${BRAND.purple})`,
                    }}
                  >
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span
                    className="text-2xl font-extrabold"
                    style={{ color: `${BRAND.teal}25` }}
                  >
                    {s.step}
                  </span>
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {s.description}
                </p>

                {/* Details */}
                <ul className="space-y-1.5">
                  {s.details.map((d) => (
                    <li
                      key={d}
                      className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400"
                    >
                      <ChevronRight
                        className="mt-0.5 h-3 w-3 shrink-0"
                        style={{ color: BRAND.teal }}
                      />
                      <span>{d}</span>
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