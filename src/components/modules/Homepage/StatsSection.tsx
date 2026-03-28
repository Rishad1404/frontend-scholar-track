"use client";

import { motion } from "framer-motion";
import { Building2, Award, Users, TrendingUp } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";


const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const stats = [
  {
    target: 50,
    suffix: "+",
    label: "Partner Universities",
    sub: "Across multiple countries",
    icon: Building2,
    color: BRAND.purple,
  },
  {
    target: 500,
    suffix: "+",
    label: "Active Scholarships",
    sub: "Worth millions in funding",
    icon: Award,
    color: BRAND.teal,
  },
  {
    target: 10000,
    suffix: "+",
    label: "Students Served",
    sub: "And growing every day",
    icon: Users,
    color: "#10b981",
  },
  {
    target: 2,
    prefix: "$",
    suffix: "M+",
    label: "Total Disbursed",
    sub: "Directly to students",
    icon: TrendingUp,
    color: "#f59e0b",
  },
];

export function StatsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-5xl"
        >
          <div className="rounded-3xl border border-gray-200/50 p-8 shadow-lg backdrop-blur-sm dark:border-gray-800/50 lg:p-12">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group text-center"
                >
                  <div className="mb-3 flex justify-center">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `${stat.color}12` }}
                    >
                      <stat.icon
                        className="h-6 w-6"
                        style={{ color: stat.color }}
                      />
                    </div>
                  </div>
                  <p
                    className="text-3xl font-extrabold tracking-tight lg:text-4xl"
                    style={{ color: stat.color }}
                  >
                    <AnimatedCounter
                      target={stat.target}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {stat.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.sub}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}