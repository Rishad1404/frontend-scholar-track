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
import { cn } from "@/lib/utils";
import { UserInfo } from "@/types/user.types";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import {
  BookOpen,
  Building2,
  ChevronRight,
  GraduationCap,
  Home,
  Info,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Shield,
  Sparkles,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// ─── Brand Colors ───
const BRAND = {
  teal: "#0097b2",
  purple: "#4b2875",
};

// ─── Mobile Nav Links ───
const MOBILE_NAV_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Scholarships", href: "/scholarships", icon: Sparkles },
  { label: "Universities", href: "/universities", icon: Building2 },
  { label: "How It Works", href: "/how-it-works", icon: BookOpen },
  { label: "About Us", href: "/about-us", icon: Info },
  { label: "Contact Us", href: "/contact-us", icon: Mail },
];

// ─── Animation Variants ───
const navContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.12 },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: easeOut },
  },
};

// ─── Role Badge Styles ───
function getRoleBadgeStyle(role: string) {
  switch (role) {
    case "SUPER_ADMIN":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
    case "UNIVERSITY_ADMIN":
      return "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300";
    case "DEPARTMENT_HEAD":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
    case "COMMITTEE_REVIEWER":
      return "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300";
    case "STUDENT":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
}

// ─── Props ───
interface MobileNavProps {
  userInfo: UserInfo | null;
  dashboardRoute: string;
  onLogout: () => void;
  isPending: boolean;
}

const MobileNav = ({
  userInfo,
  dashboardRoute,
  onLogout,
  isPending,
}: MobileNavProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const handleNavClick = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 cursor-pointer rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <X className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Menu className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[320px] p-0 border-l border-gray-200 dark:border-gray-800 [&>button]:hidden"
      >
        <div className="flex h-full flex-col bg-white dark:bg-gray-950">
          {/* ═══ Header ═══ */}
          <SheetHeader className="border-b border-gray-100 p-0 dark:border-gray-800">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

            <div className="flex h-16 items-center justify-between px-5">
              {/* Logo */}
              <Link href="/" onClick={handleNavClick}>
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="flex items-center gap-2"
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                    }}
                  >
                    <GraduationCap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span
                      className="text-lg font-bold leading-tight"
                      style={{
                        background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      ScholarTrack
                    </span>
                  </div>
                </motion.div>
              </Link>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.85 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <X className="h-4.5 w-4.5" />
              </motion.button>
            </div>

            {/* Gradient accent */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: easeOut, delay: 0.1 }}
              className="h-0.5 origin-left"
              style={{
                background: `linear-gradient(90deg, ${BRAND.teal}, ${BRAND.purple})`,
              }}
            />
          </SheetHeader>

          {/* ═══ Navigation ═══ */}
          <ScrollArea className="flex-1">
            <motion.nav
              variants={navContainerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-1 px-3 py-4"
            >
              {MOBILE_NAV_LINKS.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" &&
                    pathname.startsWith(link.href.split("#")[0]));

                const Icon = link.icon;

                return (
                  <motion.div key={link.href} variants={navItemVariants}>
                    <Link href={link.href} onClick={handleNavClick}>
                      <motion.div
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 20,
                        }}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "text-white shadow-md"
                            : "text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                        )}
                        style={
                          isActive
                            ? {
                                background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                                boxShadow: `0 4px 12px ${BRAND.teal}25`,
                              }
                            : undefined
                        }
                      >
                        {!isActive && (
                          <div
                            className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                            style={{
                              background: `linear-gradient(135deg, ${BRAND.teal}06, ${BRAND.purple}05)`,
                            }}
                          />
                        )}

                        <Icon
                          className={cn(
                            "relative z-10 h-5 w-5 shrink-0 transition-colors duration-200",
                            isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
                          )}
                        />
                        <span className="relative z-10 flex-1">{link.label}</span>

                        {!isActive && (
                          <ChevronRight className="relative z-10 h-4 w-4 -translate-x-1 text-gray-400 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>

            <div className="px-3">
              <Separator className="bg-gray-100 dark:bg-gray-800" />
            </div>

            {/* ═══ Auth Section ═══ */}
            <motion.div
              variants={navContainerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2 px-3 py-4"
            >
              {userInfo ? (
                <>
                  {/* Dashboard */}
                  <motion.div variants={navItemVariants}>
                    <Link href={dashboardRoute} onClick={handleNavClick}>
                      <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-900">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-lg"
                          style={{ background: `${BRAND.teal}10` }}
                        >
                          <LayoutDashboard
                            className="h-4 w-4"
                            style={{ color: BRAND.teal }}
                          />
                        </div>
                        <span className="flex-1">Dashboard</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  </motion.div>

                  {/* Profile */}
                  <motion.div variants={navItemVariants}>
                    <Link
                      href={
                        userInfo.role === "STUDENT"
                          ? "/student/profile"
                          : `/${
                              userInfo.role === "SUPER_ADMIN"
                                ? "super-admin"
                                : userInfo.role === "UNIVERSITY_ADMIN"
                                ? "admin"
                                : userInfo.role === "DEPARTMENT_HEAD"
                                ? "department-head"
                                : "reviewer"
                            }/my-profile`
                      }
                      onClick={handleNavClick}
                    >
                      <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-900">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                          <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <span className="flex-1">My Profile</span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  </motion.div>

                  {/* Logout */}
                  <motion.div variants={navItemVariants}>
                    <button
                      onClick={() => {
                        handleNavClick();
                        onLogout();
                      }}
                      disabled={isPending}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20">
                        <LogOut className="h-4 w-4" />
                      </div>
                      <span>
                        {isPending ? "Logging out..." : "Logout"}
                      </span>
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  {/* Login */}
                  <motion.div variants={navItemVariants}>
                    <Link href="/login" onClick={handleNavClick}>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3 rounded-xl border-gray-200 px-3 py-3 dark:border-gray-700 dark:hover:bg-gray-800"
                      >
                        <LogIn className="h-4 w-4" />
                        Log In
                      </Button>
                    </Link>
                  </motion.div>

                  {/* Register as Student */}
                  <motion.div variants={navItemVariants}>
                    <Link href="/register" onClick={handleNavClick}>
                      <div
                        className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                        style={{
                          background: `${BRAND.teal}05`,
                          border: `1px solid ${BRAND.teal}15`,
                        }}
                      >
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{
                            background: `${BRAND.teal}10`,
                            border: `1px solid ${BRAND.teal}20`,
                          }}
                        >
                          <GraduationCap
                            className="h-5 w-5"
                            style={{ color: BRAND.teal }}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            Register as Student
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Apply for scholarships
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  </motion.div>

                  {/* Register as Admin */}
                  <motion.div variants={navItemVariants}>
                    <Link href="/register-admin" onClick={handleNavClick}>
                      <div
                        className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
                        style={{
                          background: `${BRAND.purple}05`,
                          border: `1px solid ${BRAND.purple}15`,
                        }}
                      >
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{
                            background: `${BRAND.purple}10`,
                            border: `1px solid ${BRAND.purple}20`,
                          }}
                        >
                          <Shield
                            className="h-5 w-5"
                            style={{ color: BRAND.purple }}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            University Admin
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Register your university
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          </ScrollArea>

          {/* ═══ Footer (Logged In User) ═══ */}
          {userInfo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.3 }}
              className="shrink-0 border-t border-gray-100 dark:border-gray-800"
            >
              <div
                className="h-[1.5px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${BRAND.teal}30, transparent)`,
                }}
              />

              <div className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                    }}
                  >
                    <span className="text-sm font-bold">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {userInfo.name}
                    </p>
                    <span
                      className={cn(
                        "mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                        getRoleBadgeStyle(userInfo.role)
                      )}
                    >
                      {userInfo.role.toLowerCase().replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;