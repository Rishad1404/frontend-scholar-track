"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Cpu, Globe, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BRAND = { teal: "#0097b2", purple: "#4b2875" };

// Custom SVGs for Social Icons since they aren't in Lucide
const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function CreatorSection() {
  return (
    <section className="relative py-24 overflow-hidden z-10">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-[#0097b215] to-transparent blur-3xl" />
        <div className="absolute top-0 right-0 h-125 w-125 translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-[#4b287510] to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <span
            className="mb-4 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em]"
            style={{ background: `${BRAND.purple}15`, color: BRAND.purple }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            The Creator
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Built from the ground up by
          </h2>
        </motion.div>

        {/* Creator Card */}
        <div className="mx-auto max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="group relative rounded-3xl border border-border/40 bg-background/40 p-1 backdrop-blur-2xl shadow-2xl dark:border-white/10 dark:bg-background/20"
          >
            <div className="absolute inset-0 -z-10 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(circle at 50% 0%, ${BRAND.teal}15, transparent 70%)` }} />
            
            <div className="relative flex flex-col md:flex-row items-center md:items-stretch gap-8 rounded-[22px] border border-border/30 bg-card/60 p-8 sm:p-10">
              
              {/* Avatar Side */}
              <div className="flex flex-col items-center gap-6 md:w-1/3">
                <div className="relative mt-2">
                  {/* Glowing rings */}
                  <div className="absolute -inset-4 animate-pulse rounded-full opacity-30 blur-xl" style={{ background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})` }} />
                  <div className="absolute -inset-1 rounded-full opacity-50 blur-sm" style={{ background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})` }} />
                  
                  {/* Photo Avatar */}
                  <div className="relative flex h-36 w-36 overflow-hidden rounded-full shadow-2xl ring-2 ring-background/50 z-10">
                    <Image
                      src="https://i.ibb.co.com/jvLSdVkv/1646196416119.jpg"
                      alt="Md. Rishad Islam"
                      fill
                      className="object-cover object-top hover:scale-105 transition-transform duration-500"
                      unoptimized // Bypasses Next.js external domain config requirements
                    />
                  </div>
                </div>

                {/* Socials */}
                <div className="flex items-center gap-4 mt-2">
                  <a href="https://github.com/Rishad1404" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-all hover:bg-foreground hover:text-background hover:scale-110">
                    <GithubIcon className="h-5 w-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/rishad-islam14/" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-all hover:bg-[#0A66C2] hover:text-white hover:scale-110">
                    <LinkedinIcon className="h-5 w-5" />
                  </a>
                  {/* Update this link when you have your X account ready */}
                  <a href="#" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-all hover:bg-foreground hover:text-background hover:scale-110">
                    <XIcon className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Info Side */}
              <div className="flex-1 text-center md:text-left">
                <div className="mb-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    Md. Rishad Islam
                  </h3>
                  <p className="mt-1.5 text-base font-semibold" style={{ color: BRAND.teal }}>
                    Full Stack Developer
                  </p>
                </div>

                <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                  I am a passionate software engineer and a student at the <strong className="text-foreground">Bangladesh Army University of Science and Technology</strong>. I built ScholarTrack to bridge the gap between universities and students, creating a seamless, transparent pipeline for education funding.
                </p>

                {/* Tech Badges */}
                <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-2.5">
                  <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-background/50 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                    <Code2 className="h-3.5 w-3.5" style={{ color: BRAND.teal }} />
                    Full Stack Web
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-background/50 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                    <Cpu className="h-3.5 w-3.5" style={{ color: BRAND.purple }} />
                    System Architecture
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-background/50 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                    <Globe className="h-3.5 w-3.5 text-blue-500" />
                    EdTech Visionary
                  </div>
                </div>

                {/* Call to action */}
                <div className="mt-8 pt-6 border-t border-border/40">
                  <Link href="https://github.com/Rishad1404" target="_blank">
                    <motion.button
                      whileHover={{ x: 5 }}
                      className="group flex items-center gap-2 text-sm font-bold transition-colors"
                      style={{ color: BRAND.teal }}
                    >
                      View my open-source projects
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                  </Link>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}