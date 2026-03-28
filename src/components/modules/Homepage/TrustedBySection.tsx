"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Building2,
  BookOpen,
  Landmark,
  School,
  Library,
} from "lucide-react";

const logos = [
  { name: "Harvard University", icon: GraduationCap },
  { name: "MIT", icon: Building2 },
  { name: "Stanford University", icon: BookOpen },
  { name: "Oxford University", icon: Landmark },
  { name: "Cambridge University", icon: School },
  { name: "IIT Bombay", icon: Library },
];

export function TrustedBySection() {
  return (
    <section className="py-14">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500"
        >
          Trusted by Leading Institutions
        </motion.p>

        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {logos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200/50 p-4 backdrop-blur-sm transition-colors hover:border-gray-300/50 dark:border-gray-800/50 dark:hover:border-gray-700/50"
              >
                <logo.icon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 text-center leading-tight">
                  {logo.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}