"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// ─── Brand Colors ───
const BRAND = {
  teal: "#0097b2",
  purple: "#4b2875",
};

export default function GlobalLoading() {
  return (
    // Fixed overlay with frosted glass effect
    <div className="fixed inset-0 z-100 flex min-h-screen w-full items-center justify-center bg-background/60 backdrop-blur-md">
      <div className="flex flex-col items-center gap-6">
        {/* ═══ Animated Spinner & Logo Container ═══ */}
        {/* Increased size from h-20 to h-24 to give the logo room to breathe */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* Outer Ring (Teal) */}
          <motion.div
            className="absolute inset-0 rounded-full border-t-2 border-r-2"
            style={{ borderColor: BRAND.teal }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner Ring (Purple) */}
          <motion.div
            className="absolute inset-2.5 rounded-full border-b-2 border-l-2"
            style={{ borderColor: BRAND.purple }}
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />

          {/* Center Pulsing Logo */}
          <motion.div
            animate={{
              scale: [0.95, 1.05, 0.95],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative flex h-14 w-14 items-center justify-center"
          >
            {/* Soft glowing aura behind the logo */}
            <div
              className="absolute inset-0 rounded-full opacity-20 blur-md"
              style={{
                background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
              }}
            />

            {/* Your Actual Logo */}
            <Image
              src="/logo.png"
              alt="Scholar Track Loading..."
              fill
              className="object-contain relative z-10 drop-shadow-sm dark:brightness-0 dark:invert"
              priority
              sizes="(max-width: 768px) 100vw, 200px"
            />
          </motion.div>
        </div>

        {/* ═══ Typography ═══ */}
        <div className="flex flex-col items-center gap-1.5">
          <motion.h3
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-[11px] font-bold tracking-[0.25em] uppercase text-muted-foreground"
          >
            ScholarTrack
          </motion.h3>

          <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
            <span>Loading</span>
            {/* Animated Dots */}
            <span className="flex gap-0.5">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: dot * 0.2, // Stagger the dots
                    ease: "easeInOut",
                  }}
                >
                  .
                </motion.span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
