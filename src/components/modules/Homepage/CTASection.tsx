"use client";

import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, Users, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

export function CTASection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <div
            className="relative overflow-hidden rounded-3xl p-10 text-center text-white shadow-2xl lg:p-16"
            style={{
              background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
            }}
          >
            {/* Decorative dots */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Glowing orbs */}
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10">
              {/* Mini stats */}
              <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
                {[
                  { icon: Users, label: "10,000+ Students" },
                  { icon: Award, label: "500+ Scholarships" },
                  { icon: GraduationCap, label: "50+ Universities" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur-sm"
                  >
                    <s.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Heading */}
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Ready to transform your
                <br />
                scholarship journey?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                Whether you&apos;re a student seeking funding or a university
                managing scholarships, ScholarTrack has you covered.
              </p>

              {/* Buttons */}
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/register">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      size="lg"
                      className="group h-13 cursor-pointer gap-2 rounded-2xl bg-white px-8 text-base font-semibold shadow-xl hover:bg-gray-50"
                      style={{ color: BRAND.purple }}
                    >
                      Get Started Free
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                </Link>

                <Link href="/scholarships">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-13 cursor-pointer gap-2 rounded-2xl border-2 border-white/30 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20"
                    >
                      Browse Scholarships
                    </Button>
                  </motion.div>
                </Link>
              </div>

              {/* Bottom text */}
              <p className="mt-8 text-sm text-white/60">
                No credit card required &middot; Free to get started &middot;
                Cancel anytime
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}