/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Home, MapPinOff } from "lucide-react";

// ─── Brand Colors ───
const BRAND = {
  teal: "#0097b2",
  purple: "#4b2875",
};

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-center">
      {/* Subtle Background Glows matching your SaaS theme */}
      <div className="pointer-events-none absolute inset-0 flex justify-center -z-10">
        <div className="absolute -top-[20%] left-[10%] h-125 w-125 rounded-full bg-[#0097b2] opacity-10 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] h-150 w-150 rounded-full bg-[#4b2875] opacity-10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto max-w-2xl"
      >
        {/* Glassmorphic Icon Wrapper */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-border/50 bg-card/30 shadow-sm backdrop-blur-xl"
        >
          <MapPinOff className="h-10 w-10 text-muted-foreground" />
        </motion.div>

        {/* Massive Gradient 404 Text */}
        <h1
          className="mb-4 text-8xl font-black tracking-tighter sm:text-9xl"
          style={{
            background: `linear-gradient(135deg, ${BRAND.teal}, ${BRAND.purple})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </h1>

        <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Lost in the campus?
        </h2>

        <p className="mb-10 text-base font-medium text-muted-foreground sm:text-lg px-4">
          The page you are looking for doesn't exist, has been moved, or you don't have the necessary permissions to access it.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => router.back()}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-background/50 px-8 text-sm font-bold text-foreground shadow-sm backdrop-blur-md transition-all hover:bg-muted/50 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </button>

          <Link
            href="/" // Change this to "/dashboard" if you prefer they go to the app instead of the landing page
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl px-8 text-sm font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95 sm:w-auto"
            style={{
              background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
            }}
          >
            <Home className="h-4 w-4 transition-transform group-hover:scale-110" />
            Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}