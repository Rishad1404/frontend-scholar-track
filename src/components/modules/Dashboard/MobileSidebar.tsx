"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/types/dashboard.types";
import { UserInfo } from "@/types/user.types";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { LogOut, ChevronRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// ─── Brand ───
const BRAND = {
  teal: "#0097b2",
  purple: "#4b2875",
};

// ─── Role Badge Styles ───
function getRoleBadgeStyle(role: string) {
  switch (role) {
    case "SUPER_ADMIN":
      return {
        background: `linear-gradient(135deg, ${BRAND.purple}20, ${BRAND.teal}20)`,
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
}

// ─── Animation Variants ───
const navContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.15,
    },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.02, staggerDirection: -1 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: easeOut },
  },
  exit: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.15 },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: easeOut,
    },
  },
  exit: {
    opacity: 0,
    x: -12,
    scale: 0.95,
    transition: { duration: 0.12 },
  },
};

const userInfoVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easeOut,
      delay: 0.25,
    },
  },
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: easeOut,
      delay: 0.05,
    },
  },
};

// ─── Props ───
interface MobileSidebarProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
  onLogout: () => void;
}

const MobileSidebar = ({
  userInfo,
  navItems,
  dashboardHome,
  onLogout,
}: MobileSidebarProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const roleBadgeStyle = getRoleBadgeStyle(userInfo.role);

  const handleNavClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 cursor-pointer rounded-xl text-muted-foreground transition-colors hover:text-foreground md:hidden"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <X className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <Menu className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-71.25 p-0 border-r-0 [&>button]:hidden">
        <div className="flex h-full flex-col overflow-hidden">
          {/* ═══ Header ═══ */}
          <SheetHeader className="border-b p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <motion.div variants={logoVariants} initial="hidden" animate="visible">
              <div
                className="flex h-16 items-center justify-between px-5"
                style={{
                  background: `linear-gradient(135deg, ${BRAND.purple}08, ${BRAND.teal}08)`,
                }}
              >
                <Link href={dashboardHome} onClick={handleNavClick}>
                  <motion.div
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 15,
                    }}
                  >
                    <Image
                      src="/logo.png"
                      alt="ScholarTrack"
                      width={140}
                      height={40}
                      className="h-9 w-auto object-contain"
                      priority
                    />
                  </motion.div>
                </Link>

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.85 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                  }}
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                >
                  <X className="h-4.5 w-4.5" />
                </motion.button>
              </div>
            </motion.div>

            {/* Gradient accent */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: easeOut, delay: 0.1 }}
              className="h-0.5 origin-left"
              style={{
                background: `linear-gradient(90deg, ${BRAND.purple}, ${BRAND.teal}, ${BRAND.purple}40)`,
              }}
            />
          </SheetHeader>

          {/* ═══ Navigation ═══ */}
          <ScrollArea className="flex-1 overflow-hidden">
            <motion.nav
              variants={navContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-5 px-3 py-4"
            >
              {navItems.map((section, sectionId) => (
                <motion.div key={sectionId} variants={sectionVariants}>
                  {/* Section Title */}
                  {section.title && (
                    <motion.div
                      variants={navItemVariants}
                      className="mb-2 flex items-center gap-2 px-3"
                    >
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: 0.4,
                          ease: easeOut,
                          delay: 0.2 + sectionId * 0.05,
                        }}
                        className="h-px flex-1 origin-left"
                        style={{
                          background: `linear-gradient(90deg, ${BRAND.teal}25, transparent)`,
                        }}
                      />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                        {section.title}
                      </span>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: 0.4,
                          ease: easeOut,
                          delay: 0.2 + sectionId * 0.05,
                        }}
                        className="h-px flex-1 origin-right"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${BRAND.teal}25)`,
                        }}
                      />
                    </motion.div>
                  )}

                  {/* Nav Items */}
                  <div className="space-y-0.5">
                    {section.items.map((item, id) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));

                      const Icon = getIconComponent(item.icon);

                      return (
                        <motion.div key={id} variants={navItemVariants}>
                          <Link href={item.href} onClick={handleNavClick}>
                            <motion.div
                              whileHover={{ x: 3 }}
                              whileTap={{ scale: 0.97, x: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 20,
                              }}
                              className={cn(
                                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                  ? "text-white shadow-md"
                                  : "text-muted-foreground hover:text-foreground",
                              )}
                              style={
                                isActive
                                  ? {
                                      background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                                      boxShadow: `0 4px 12px ${BRAND.teal}30`,
                                    }
                                  : undefined
                              }
                            >
                              {/* Hover bg */}
                              {!isActive && (
                                <div
                                  className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                  style={{
                                    background: `linear-gradient(135deg, ${BRAND.purple}06, ${BRAND.teal}08)`,
                                  }}
                                />
                              )}

                              {/* Active indicator bar */}
                              <AnimatePresence>
                                {isActive && (
                                  <motion.div
                                    initial={{ scaleY: 0, opacity: 0 }}
                                    animate={{ scaleY: 1, opacity: 1 }}
                                    exit={{ scaleY: 0, opacity: 0 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 300,
                                      damping: 25,
                                    }}
                                    className="absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full bg-white/80"
                                  />
                                )}
                              </AnimatePresence>

                              <Icon
                                className={cn(
                                  "relative z-10 h-4.5 w-4.5 shrink-0 transition-all duration-200",
                                  isActive
                                    ? "text-white"
                                    : "text-muted-foreground group-hover:text-foreground",
                                )}
                              />
                              <span className="relative z-10 flex-1">{item.title}</span>

                              {!isActive && (
                                <ChevronRight className="relative z-10 h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-50" />
                              )}
                            </motion.div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  {sectionId < navItems.length - 1 && (
                    <motion.div variants={navItemVariants} className="pt-3">
                      <Separator className="opacity-40" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.nav>
          </ScrollArea>

          {/* ═══ User Info + Logout ═══ */}
          <motion.div
            variants={userInfoVariants}
            initial="hidden"
            animate="visible"
            className="shrink-0 border-t"
          >
            {/* Gradient line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: easeOut, delay: 0.3 }}
              className="h-px origin-center"
              style={{
                background: `linear-gradient(90deg, transparent, ${BRAND.teal}20, transparent)`,
              }}
            />

            <div className="px-3 py-3.5">
              <motion.div
                whileHover={{ backgroundColor: "rgba(0,0,0,0.03)" }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 rounded-xl p-2.5"
              >
                {/* Avatar */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                  }}
                  className="relative shrink-0"
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-white ring-2 ring-offset-1 ring-offset-card"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                    }}
                  >
                    <span className="text-sm font-bold">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* Online dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 15,
                      delay: 0.4,
                    }}
                    className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card"
                    style={{ background: "#22c55e" }}
                  />
                </motion.div>

                {/* Name & Role */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{userInfo.name}</p>
                  <span
                    className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={roleBadgeStyle}
                  >
                    {userInfo.role.toLowerCase().replace(/_/g, " ")}
                  </span>
                </div>

                {/* Logout */}
                <motion.button
                  whileHover={{ scale: 1.15, rotate: -5 }}
                  whileTap={{ scale: 0.85 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                  }}
                  onClick={() => {
                    handleNavClick();
                    onLogout();
                  }}
                  className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
