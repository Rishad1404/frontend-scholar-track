"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Headphones,
} from "lucide-react";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "For general inquiries and support",
    value: "support@scholartrack.io",
    subValue: "partnerships@scholartrack.io",
    color: BRAND.teal,
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Mon-Fri, 9am to 6pm (BST)",
    value: "+880 1700-000000",
    subValue: "+1 (555) 123-4567",
    color: BRAND.purple,
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Our headquarters",
    value: "Dhaka, Bangladesh",
    subValue: "Tech Hub, Level 5",
    color: "#10b981",
  },
  {
    icon: Clock,
    title: "Business Hours",
    description: "When we're available",
    value: "Mon - Fri: 9:00 AM - 6:00 PM",
    subValue: "Sat: 10:00 AM - 2:00 PM",
    color: "#f59e0b",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Quick answers to quick questions",
    value: "Available on Dashboard",
    subValue: "Average response: 5 mins",
    color: "#8b5cf6",
  },
  {
    icon: Headphones,
    title: "Premium Support",
    description: "For subscribed universities",
    value: "Priority ticket system",
    subValue: "Dedicated account manager",
    color: "#ef4444",
  },
];

export function ContactInfoSection() {
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
            Reach Us
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Multiple ways to{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${BRAND.teal}, ${BRAND.purple})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              connect
            </span>
          </h2>
        </motion.div>

        <div className="mx-auto max-w-6xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {contactMethods.map((method, index) => (
            <motion.div
              key={method.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <motion.div
                whileHover={{ y: -4 }}
                className="group h-full rounded-2xl border border-gray-200/50 p-6 transition-shadow hover:shadow-lg dark:border-gray-800/50"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{
                    background: `${method.color}12`,
                    border: `1px solid ${method.color}20`,
                  }}
                >
                  <method.icon
                    className="h-6 w-6"
                    style={{ color: method.color }}
                  />
                </div>

                <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                  {method.title}
                </h3>
                <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                  {method.description}
                </p>

                <p
                  className="text-sm font-semibold"
                  style={{ color: method.color }}
                >
                  {method.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {method.subValue}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}