"use client";

import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

export function AboutCTASection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl"
        >
          <div
            className="relative overflow-hidden rounded-3xl p-10 text-center text-white shadow-2xl lg:p-14"
            style={{
              background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
            }}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Join our mission to make
                <br />
                education accessible
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-white/80">
                Whether you&apos;re a student looking for funding or an
                institution wanting to streamline your scholarship process —
                we&apos;re here for you.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      size="lg"
                      className="group h-12 cursor-pointer gap-2 rounded-2xl bg-white px-8 font-semibold shadow-xl text-[#4b2875] dark:text-purple-300 hover:bg-gray-50"
                      
                    >
                      <GraduationCap className="h-5 w-5" />
                      Get Started
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                </Link>

                <Link href="/contact-us">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-12 cursor-pointer gap-2 rounded-2xl border-2 border-white/30 bg-white/10 px-8 font-semibold text-white backdrop-blur-sm hover:bg-white/20"
                    >
                      <Building2 className="h-5 w-5" />
                      Contact Us
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}