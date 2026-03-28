"use client";

import { motion } from "framer-motion";
import { Check, Info, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

const features = [
  "Unlimited student applications",
  "AI-powered screening tools",
  "Automated disbursement tracking",
  "Multi-role access (Reviewers, Heads)",
  "Dedicated university dashboard",
  "24/7 priority email support",
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section id="pricing" className="relative py-24 z-10">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-12 text-center"
        >
          <span
            className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider"
            style={{ background: `${BRAND.teal}15`, color: BRAND.teal }}
          >
            Simple Pricing
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Transparent plans for{" "}
            <span style={{ background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Universities
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Register your institution for free today. Set up your profile, and upgrade to an active plan from your dashboard when you are ready to publish scholarships.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <div className="mb-12 flex justify-center">
          <div className="relative inline-flex items-center rounded-full border border-border/40 bg-card/50 p-1 backdrop-blur-sm shadow-sm">
            <button
              onClick={() => setIsYearly(false)}
              className={`relative z-10 w-32 rounded-full py-2.5 text-sm font-semibold transition-colors duration-300 ${!isYearly ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`relative z-10 w-32 rounded-full py-2.5 text-sm font-semibold transition-colors duration-300 ${isYearly ? "text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              Yearly
            </button>
            
            {/* Sliding Pill Background */}
            <motion.div
              layout
              initial={false}
              animate={{
                x: isYearly ? "100%" : "0%",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute left-1 top-1 bottom-1 w-32 rounded-full shadow-sm"
              style={{
                background: isYearly 
                  ? `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})` 
                  : "var(--background)",
                border: isYearly ? "none" : "1px solid var(--border)",
              }}
            />
            
            {/* Save Badge */}
            <div className="absolute -right-8 -top-3 rotate-12 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
              Save 16%
            </div>
          </div>
        </div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl"
        >
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl dark:border-white/10">
            {/* Decorative Glow */}
            <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full opacity-30 blur-3xl" style={{ background: BRAND.teal }} />
            
            <div className="flex flex-col md:flex-row">
              
              {/* Left Side: Price & CTA */}
              <div className="flex flex-col justify-center p-8 md:w-2/5 md:border-r border-border/40 md:p-12">
                <div className="mb-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                  {isYearly ? "Annual Plan" : "Monthly Plan"}
                </div>
                <div className="mb-6 flex items-baseline text-foreground">
                  <span className="text-5xl font-black tracking-tight">৳{isYearly ? "9,999" : "999"}</span>
                  <span className="ml-2 text-sm font-medium text-muted-foreground">/ {isYearly ? "year" : "month"}</span>
                </div>
                
                <Link href="/register-admin" className="w-full">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex h-14 items-center justify-center gap-2 rounded-2xl text-[15px] font-bold text-white shadow-lg transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                      boxShadow: `0 8px 24px ${BRAND.teal}40, inset 0 1px 1px rgba(255,255,255,0.3)`,
                    }}
                  >
                    Register University
                  </motion.button>
                </Link>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Info className="h-3.5 w-3.5" />
                  No payment required during setup
                </div>
              </div>

              {/* Right Side: Features */}
              <div className="bg-muted/10 p-8 md:w-3/5 md:p-12">
                <div className="mb-6 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" style={{ color: BRAND.teal }} />
                  <h4 className="text-lg font-bold text-foreground">Everything you need included</h4>
                </div>
                
                <ul className="grid gap-y-4 sm:grid-cols-2">
                  {features.map((feature, i) => (
                    <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: `${BRAND.teal}15` }}>
                        <Check className="h-3 w-3" style={{ color: BRAND.teal }} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}