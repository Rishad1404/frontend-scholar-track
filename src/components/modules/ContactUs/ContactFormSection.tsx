"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, User, Mail, Building2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const inquiryTypes = [
  "General Inquiry",
  "University Partnership",
  "Technical Support",
  "Billing & Subscription",
  "Bug Report",
  "Feature Request",
];

export function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    inquiryType: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <section className="py-10">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Email Row */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <User className="h-4 w-4" style={{ color: BRAND.teal }} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-gray-200/60 px-4 py-3 text-sm outline-none transition-all focus:border-transparent focus:ring-2 dark:border-gray-700/60 dark:text-white dark:placeholder-gray-500 bg-transparent"
                  style={
                    { "--tw-ring-color": BRAND.teal } as React.CSSProperties
                  }
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Mail className="h-4 w-4" style={{ color: BRAND.teal }} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-gray-200/60 px-4 py-3 text-sm outline-none transition-all focus:border-transparent focus:ring-2 dark:border-gray-700/60 dark:text-white dark:placeholder-gray-500 bg-transparent"
                  style={
                    { "--tw-ring-color": BRAND.teal } as React.CSSProperties
                  }
                />
              </div>
            </div>

            {/* Organization & Inquiry Type */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Building2
                    className="h-4 w-4"
                    style={{ color: BRAND.teal }}
                  />
                  Organization{" "}
                  <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="University or Company"
                  className="w-full rounded-xl border border-gray-200/60 px-4 py-3 text-sm outline-none transition-all focus:border-transparent focus:ring-2 dark:border-gray-700/60 dark:text-white dark:placeholder-gray-500 bg-transparent"
                  style={
                    { "--tw-ring-color": BRAND.teal } as React.CSSProperties
                  }
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MessageSquare
                    className="h-4 w-4"
                    style={{ color: BRAND.teal }}
                  />
                  Inquiry Type
                </label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200/60 px-4 py-3 text-sm outline-none transition-all focus:border-transparent focus:ring-2 dark:border-gray-700/60 dark:text-white bg-transparent"
                  style={
                    { "--tw-ring-color": BRAND.teal } as React.CSSProperties
                  }
                >
                  <option value="" disabled>
                    Select type...
                  </option>
                  {inquiryTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Brief description of your inquiry"
                className="w-full rounded-xl border border-gray-200/60 px-4 py-3 text-sm outline-none transition-all focus:border-transparent focus:ring-2 dark:border-gray-700/60 dark:text-white dark:placeholder-gray-500 bg-transparent"
                style={
                  { "--tw-ring-color": BRAND.teal } as React.CSSProperties
                }
              />
            </div>

            {/* Message */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Tell us more about how we can help..."
                className="w-full resize-none rounded-xl border border-gray-200/60 px-4 py-3 text-sm outline-none transition-all focus:border-transparent focus:ring-2 dark:border-gray-700/60 dark:text-white dark:placeholder-gray-500 bg-transparent"
                style={
                  { "--tw-ring-color": BRAND.teal } as React.CSSProperties
                }
              />
            </div>

            {/* Submit */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                size="lg"
                className="group w-full h-12 cursor-pointer gap-2 rounded-2xl text-base font-semibold text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                }}
              >
                <Send className="h-4 w-4" />
                Send Message
              </Button>
            </motion.div>

            <p className="text-center text-xs text-gray-400 dark:text-gray-500">
              By submitting, you agree to our Privacy Policy. We&apos;ll never
              share your information.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}