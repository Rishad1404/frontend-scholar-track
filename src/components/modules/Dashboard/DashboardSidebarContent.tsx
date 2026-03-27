"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.types";
import { UserInfo } from "@/types/user.types";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { LogOut, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── Brand ───
const BRAND = {
  teal: "#0097b2",
  purple: "#4b2875",
};

// ─── Animation Variants ───
const sidebarVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: easeOut,
      staggerChildren: 0.04,
      delayChildren: 0.15,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: easeOut },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: easeOut },
  },
};

const userInfoVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeOut, delay: 0.3 },
  },
};

// ─── Role Badge Colors ───
const getRoleBadgeStyle = (role: string) => {
  switch (role) {
    case "SUPER_ADMIN":
      return {
        background: `${BRAND.purple}15`,
        color: BRAND.purple,
        border: `1px solid ${BRAND.purple}30`,
      };
    case "UNIVERSITY_ADMIN":
      return {
        background: `${BRAND.teal}15`,
        color: BRAND.teal,
        border: `1px solid ${BRAND.teal}30`,
      };
    case "DEPARTMENT_HEAD":
      return {
        background: "#f59e0b15",
        color: "#d97706",
        border: "1px solid #f59e0b30",
      };
    case "COMMITTEE_REVIEWER":
      return {
        background: "#8b5cf615",
        color: "#7c3aed",
        border: "1px solid #8b5cf630",
      };
    case "STUDENT":
      return {
        background: "#10b98115",
        color: "#059669",
        border: "1px solid #10b98130",
      };
    default:
      return {
        background: "#6b728015",
        color: "#6b7280",
        border: "1px solid #6b728030",
      };
  }
};

// ─── Props ───
interface DashboardSidebarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
  onLogout?: () => void;
}

const DashboardSidebarContent = ({
  dashboardHome,
  navItems,
  userInfo,
  onLogout,
}: DashboardSidebarContentProps) => {
  const pathname = usePathname();
  const roleBadgeStyle = getRoleBadgeStyle(userInfo.role);

  return (
    <motion.div
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="hidden md:flex h-screen w-67.5 flex-col border-r border-border/60 bg-card/95 backdrop-blur-md"
    >
      {/* ═══ Logo / Brand — Fixed ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeOut }}
        className="shrink-0 border-b border-border/60"
      >
        <Link href={dashboardHome} className="block">
          <div className="flex h-16 items-center gap-3 px-5 transition-colors duration-300 hover:bg-muted/30">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Image
                src="/logo.png"
                alt="ScholarTrack"
                width={140}
                height={40}
                className="h-9 w-auto object-contain dark:brightness-0 dark:invert"
                priority
              />
            </motion.div>
          </div>
        </Link>
      </motion.div>

      {/* ═══ Navigation — Scrollable ═══ */}
      <ScrollArea className="flex-1 overflow-hidden">
        <nav className="space-y-6 px-3 py-5">
          {navItems.map((section, sectionId) => (
            <motion.div key={sectionId} variants={sectionVariants}>
              {/* Section Title */}
              {section.title && (
                <motion.div
                  variants={navItemVariants}
                  className="mb-2.5 flex items-center gap-2 px-3"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground/80">
                    {section.title}
                  </span>
                  <div className="h-px flex-1 bg-border/60" />
                </motion.div>
              )}

              {/* Nav Items */}
              <div className="space-y-1">
                {section.items.map((item, id) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));

                  const Icon = getIconComponent(item.icon);

                  return (
                    <motion.div key={id} variants={navItemVariants}>
                      <Link href={item.href}>
                        <motion.div
                          whileHover={{ x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                          }}
                          className={cn(
                            "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                            isActive
                              ? "" // Active state is handled by inline styles below
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/60 dark:hover:bg-muted/20"
                          )}
                          style={
                            isActive
                              ? {
                                  backgroundColor: `${BRAND.teal}15`, // Professional 15% opacity subtle background
                                  color: BRAND.teal,
                                }
                              : undefined
                          }
                        >
                          {/* Active indicator bar */}
                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                layoutId="activeIndicator"
                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
                                style={{ backgroundColor: BRAND.teal }}
                                initial={{ opacity: 0, scaleY: 0 }}
                                animate={{ opacity: 1, scaleY: 1 }}
                                exit={{ opacity: 0, scaleY: 0 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 25,
                                }}
                              />
                            )}
                          </AnimatePresence>

                          <Icon
                            className={cn(
                              "w-4.5 h-4.5 shrink-0 relative z-10 transition-colors duration-200",
                              !isActive && "text-muted-foreground group-hover:text-foreground"
                            )}
                          />
                          <span className="relative z-10 flex-1">{item.title}</span>

                          {/* Arrow on hover for inactive */}
                          {!isActive && (
                            <ChevronRight className="w-3.5 h-3.5 relative z-10 opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-200" />
                          )}
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </nav>
      </ScrollArea>

      {/* ═══ User Info — Fixed at bottom ═══ */}
      <motion.div
        variants={userInfoVariants}
        initial="hidden"
        animate="visible"
        className="shrink-0 border-t border-border/60 bg-muted/10"
      >
        <div className="px-3 py-4">
          <div className="flex items-center gap-3 rounded-xl p-2 transition-colors duration-200 hover:bg-muted/50">
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="relative shrink-0"
            >
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: BRAND.purple }}
              >
                <span className="text-sm font-bold text-white">
                  {userInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
              {/* Online indicator */}
              <div
                className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-card"
                style={{ background: "#10b981" }}
              />
            </motion.div>

            {/* Name & Role */}
            <div className="flex-1 overflow-hidden min-w-0">
              <p className="text-sm font-bold truncate text-foreground leading-none">
                {userInfo.name}
              </p>
              <div className="mt-1.5">
                <span
                  className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider rounded-md px-1.5 py-0.5"
                  style={roleBadgeStyle}
                >
                  {userInfo.role.toLowerCase().replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onLogout}
                className="shrink-0 p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors duration-200"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardSidebarContent;