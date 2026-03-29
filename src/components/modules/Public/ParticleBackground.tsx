/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  PenTool,
  BookOpen,
  GraduationCap,
  Lightbulb,
  Target,
  Pencil,
  Ruler,
  Award,
  FileText,
  Globe,
  Atom,
  Trophy,
  Star,
  Sparkles,
  BookMarked,
} from "lucide-react";

// ─── Brand ───
const BRAND = {
  teal: "#0097b2",
  purple: "#4b2875",
};

// ─── Floating Educational Icons ───
const floatingIcons = [
  { Icon: PenTool, left: "4%", top: "5%", size: 48, duration: 18, delay: 0, rotate: -15 },
  { Icon: BookOpen, left: "78%", top: "8%", size: 56, duration: 21, delay: 2, rotate: 10 },
  { Icon: GraduationCap, left: "85%", top: "40%", size: 52, duration: 16, delay: 4, rotate: -8 },
  { Icon: Lightbulb, left: "8%", top: "38%", size: 44, duration: 20, delay: 1, rotate: 12 },
  { Icon: Target, left: "72%", top: "75%", size: 46, duration: 22, delay: 3, rotate: -20 },
  { Icon: Pencil, left: "16%", top: "80%", size: 42, duration: 17, delay: 5, rotate: 25 },
  { Icon: Ruler, left: "50%", top: "3%", size: 44, duration: 19, delay: 2.5, rotate: -5 },
  { Icon: BookOpen, left: "88%", top: "82%", size: 40, duration: 23, delay: 1.5, rotate: 15 },
  { Icon: Award, left: "35%", top: "90%", size: 50, duration: 20, delay: 3.5, rotate: -12 },
  { Icon: FileText, left: "92%", top: "20%", size: 42, duration: 18, delay: 0.5, rotate: 8 },
  { Icon: Globe, left: "25%", top: "15%", size: 46, duration: 24, delay: 4.5, rotate: -18 },
  { Icon: Atom, left: "60%", top: "55%", size: 48, duration: 17, delay: 2, rotate: 22 },
  { Icon: Trophy, left: "40%", top: "45%", size: 44, duration: 21, delay: 1, rotate: -10 },
  { Icon: Star, left: "15%", top: "60%", size: 38, duration: 19, delay: 3, rotate: 15 },
  { Icon: Sparkles, left: "68%", top: "30%", size: 40, duration: 22, delay: 5.5, rotate: -25 },
  { Icon: BookMarked, left: "55%", top: "88%", size: 42, duration: 16, delay: 0.8, rotate: 18 },
  { Icon: GraduationCap, left: "3%", top: "70%", size: 50, duration: 25, delay: 2.2, rotate: -6 },
  { Icon: Lightbulb, left: "45%", top: "22%", size: 36, duration: 20, delay: 4, rotate: 30 },
  { Icon: PenTool, left: "75%", top: "60%", size: 38, duration: 18, delay: 1.8, rotate: -22 },
  { Icon: Target, left: "30%", top: "65%", size: 44, duration: 23, delay: 3.2, rotate: 14 },
];

const ParticleBackground = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  // Prevent server/client hydration mismatches by rendering this
  // visual-only background only on the client after mount.
  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* ─── Gradient Overlays ─── */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? `radial-gradient(ellipse at 15% 5%, ${BRAND.teal}08 0%, transparent 50%), 
               radial-gradient(ellipse at 85% 90%, ${BRAND.purple}08 0%, transparent 50%),
               radial-gradient(ellipse at 50% 50%, ${BRAND.teal}04 0%, transparent 70%)`
            : `radial-gradient(ellipse at 15% 5%, ${BRAND.teal}06 0%, transparent 50%), 
               radial-gradient(ellipse at 85% 90%, ${BRAND.purple}06 0%, transparent 50%),
               radial-gradient(ellipse at 50% 50%, ${BRAND.teal}03 0%, transparent 70%)`,
        }}
      />

      {/* ─── Floating Icons ─── */}
      {mounted &&
        floatingIcons.map((item, i) => {
          const iconOpacity = isDark ? 0.12 : 0.08;
          const iconColor = i % 3 === 0
            ? BRAND.teal
            : i % 3 === 1
            ? BRAND.purple
            : "#10b981";

          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: item.left,
                top: item.top,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: iconOpacity,
                scale: 1,
                y: [0, -18, 0, 18, 0],
                x: [0, 10, 0, -10, 0],
                rotate: [
                  item.rotate,
                  item.rotate + 12,
                  item.rotate,
                  item.rotate - 12,
                  item.rotate,
                ],
              }}
              transition={{
                opacity: { duration: 1, delay: item.delay * 0.3 },
                scale: { duration: 1, delay: item.delay * 0.3 },
                y: {
                  duration: item.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay,
                },
                x: {
                  duration: item.duration * 1.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay + 1,
                },
                rotate: {
                  duration: item.duration * 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay,
                },
              }}
            >
              <item.Icon
                size={item.size}
                strokeWidth={1.2}
                style={{ color: iconColor }}
              />
            </motion.div>
          );
        })}

      {/* ─── Glowing Orbs ─── */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 400,
          height: 400,
          left: "10%",
          top: "15%",
          background: isDark
            ? `radial-gradient(circle, ${BRAND.teal}08, transparent 70%)`
            : `radial-gradient(circle, ${BRAND.teal}05, transparent 70%)`,
        }}
        animate={{
          x: [0, 40, 0, -40, 0],
          y: [0, -30, 0, 30, 0],
          scale: [1, 1.1, 1, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 350,
          height: 350,
          right: "5%",
          top: "50%",
          background: isDark
            ? `radial-gradient(circle, ${BRAND.purple}08, transparent 70%)`
            : `radial-gradient(circle, ${BRAND.purple}05, transparent 70%)`,
        }}
        animate={{
          x: [0, -30, 0, 30, 0],
          y: [0, 40, 0, -40, 0],
          scale: [1, 0.95, 1, 1.05, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 300,
          height: 300,
          left: "50%",
          bottom: "10%",
          background: isDark
            ? `radial-gradient(circle, ${BRAND.teal}06, transparent 70%)`
            : `radial-gradient(circle, ${BRAND.teal}04, transparent 70%)`,
        }}
        animate={{
          x: [0, 50, 0, -50, 0],
          y: [0, -20, 0, 20, 0],
          scale: [1, 1.08, 1, 0.92, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      {/* ─── Dot Grid Pattern ─── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? `radial-gradient(circle, ${BRAND.teal}08 1px, transparent 1px)`
            : `radial-gradient(circle, ${BRAND.teal}05 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
};

export default ParticleBackground;