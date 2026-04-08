/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getDefaultDashboardRoute, UserRole } from "@/lib/authUtils";
import { logoutAction } from "@/services/auth.services";
import { UserInfo } from "@/types/user.types";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Moon,
  Shield,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import MobileNav from "./MobileNav";

// ─── Brand Colors ───
const BRAND = {
  teal: "#0097b2",
  purple: "#4b2875",
};

// ─── Nav Links ───
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "Universities", href: "/universities" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
];

// ─── Role Badge ───
function getRoleBadgeClass(role: string) {
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
interface NavbarContentProps {
  userInfo: UserInfo | null;
}

const NavbarContent = ({ userInfo }: NavbarContentProps) => {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  const dashboardRoute = userInfo
    ? getDefaultDashboardRoute(userInfo.role as UserRole)
    : "/login";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profileImg = (userInfo as any)?.profilePhoto || (userInfo as any)?.image;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 lg:pt-6 pointer-events-none">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          /* 1. Increased max-width from max-w-7xl to max-w-[1400px] */
          "pointer-events-auto relative w-[98%] max-w-350 overflow-hidden rounded-full transition-all duration-500",
          isScrolled
            ? /* 2. Lowered opacity to bg-background/60 for a more translucent glass effect */
              "border border-border/40 bg-background/60 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15),0_4px_12px_rgba(0,0,0,0.06)] backdrop-blur-2xl dark:border-white/10 dark:bg-background/40 dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] py-1.5"
            : "border border-border/20 bg-background/20 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/5 dark:bg-background/20 py-2.5",
        )}
      >
        {/* ═══ 3D Inner Glow / Highlights ═══ */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.2)] pointer-events-none" />

        <div className="flex h-12 lg:h-14 items-center justify-between px-5 lg:px-8">
          {/* ═══ Left: Logo (Reduced to 20% width to give links more room) ═══ */}
          <div className="flex shrink-0 lg:basis-[20%] justify-start">
            <Link href="/" className="relative z-10">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Image
                  src="/logo.png"
                  alt="ScholarTrack"
                  width={160}
                  height={44}
                  className="h-8 w-auto object-contain lg:h-10 dark:brightness-0 dark:invert drop-shadow-sm"
                  style={{ width: "auto" }}
                  priority
                />
              </motion.div>
            </Link>
          </div>

          {/* ═══ Center: Desktop Nav Links (Expanded to 60% width) ═══ */}
          <div className="hidden lg:flex lg:basis-[60%] justify-center">
            <nav className="flex items-center gap-1 xl:gap-2">
              {NAV_LINKS.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]));

                return (
                  <Link key={link.href} href={link.href}>
                    <motion.span
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className={cn(
                        /* 3. Added whitespace-nowrap so text NEVER wraps to a second line */
                        "group relative inline-flex items-center whitespace-nowrap rounded-full px-3.5 xl:px-4 py-2.5 text-[13.5px] font-semibold tracking-wide transition-all duration-200",
                        isActive
                          ? "text-white"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {/* Active background */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavBg"
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                            boxShadow: `0 4px 14px ${BRAND.teal}30, inset 0 1px 1px rgba(255,255,255,0.2)`,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 30,
                          }}
                        />
                      )}

                      {/* Hover background for inactive */}
                      {!isActive && (
                        <div className="absolute inset-0 rounded-full bg-muted/0 transition-colors duration-200 group-hover:bg-muted/50" />
                      )}

                      <span className="relative z-10">{link.label}</span>
                    </motion.span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ═══ Right Section (Reduced to 20% width) ═══ */}
          <div className="flex items-center gap-3 lg:basis-[20%] justify-end">
            {/* ─── Theme Toggle ─── */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="h-10 w-10 cursor-pointer rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors border border-transparent hover:border-border/50"
                title="Toggle theme"
              >
                {mounted ? (
                  <motion.div
                    key={resolvedTheme}
                    initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                  >
                    {resolvedTheme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </motion.div>
                ) : (
                  <div className="h-5 w-5" />
                )}
              </Button>
            </motion.div>

            {/* Divider */}
            <div className="hidden h-6 w-px bg-border/40 lg:block" />

            {/* ─── Auth (Desktop) ─── */}
            <div className="hidden items-center gap-3 lg:flex">
              {userInfo ? (
                /* ─── Logged In ─── */
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex cursor-pointer items-center gap-3 rounded-full border border-border/40 bg-background/40 pl-2 pr-3 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-border hover:bg-muted/50 hover:shadow-md"
                    >
                      <div className="relative">
                        {profileImg ? (
                          <Image
                            src={profileImg}
                            alt="Profile"
                            width={32}
                            height={32}
                            unoptimized
                            className="h-8 w-8 rounded-full object-cover shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
                          />
                        ) : (
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-full text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]"
                            style={{
                              background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                            }}
                          >
                            <span className="text-[12px] font-bold">
                              {userInfo.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
                      </div>

                      <span className="max-w-27.5 truncate text-[13.5px] font-bold text-foreground">
                        {userInfo.name}
                      </span>

                      <ChevronDown className="h-4 w-4 text-muted-foreground/70" />
                    </motion.button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={16}
                    className="w-64 rounded-3xl border border-border/40 bg-card/95 p-2 shadow-2xl backdrop-blur-xl"
                  >
                    <DropdownMenuLabel className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        {profileImg ? (
                          <Image
                            src={profileImg}
                            alt="Profile"
                            width={48}
                            height={48}
                            unoptimized
                            className="h-12 w-12 shrink-0 rounded-full object-cover shadow-md"
                          />
                        ) : (
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-md"
                            style={{
                              background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                            }}
                          >
                            <span className="text-lg font-bold">
                              {userInfo.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-foreground">
                            {userInfo.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground/80 mt-0.5">
                            {userInfo.email}
                          </p>
                          <span
                            className={cn(
                              "mt-2 inline-block rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                              getRoleBadgeClass(userInfo.role),
                            )}
                          >
                            {userInfo.role.toLowerCase().replace(/_/g, " ")}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="my-1.5 bg-border/40" />

                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer rounded-2xl px-3 py-3 transition-colors hover:bg-muted/50"
                    >
                      <Link href={dashboardRoute} className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-full"
                          style={{ background: `${BRAND.teal}15` }}
                        >
                          <LayoutDashboard
                            className="h-4.5 w-4.5"
                            style={{ color: BRAND.teal }}
                          />
                        </div>
                        <span className="flex-1 text-sm font-bold">Go to Dashboard</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer rounded-2xl px-3 py-3 transition-colors hover:bg-muted/50"
                    >
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
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                          <User className="h-4.5 w-4.5 text-muted-foreground" />
                        </div>
                        <span className="flex-1 text-sm font-bold">My Profile</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1.5 bg-border/40" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      disabled={isPending}
                      className="cursor-pointer rounded-2xl px-3 py-3 text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {isPending ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.8,
                              ease: "linear",
                            }}
                          >
                            <LogOut className="h-4.5 w-4.5" />
                          </motion.div>
                        ) : (
                          <LogOut className="h-4.5 w-4.5" />
                        )}
                        <span className="text-sm font-bold">
                          {isPending ? "Logging out..." : "Logout"}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                /* ─── Not Logged In ─── */
                <>
                  <Link href="/login">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button
                        variant="ghost"
                        className="cursor-pointer rounded-full px-5 text-sm font-bold text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                      >
                        Log In
                      </Button>
                    </motion.div>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                          className="cursor-pointer gap-2 rounded-full px-7 py-5 text-[13.5px] font-bold text-white shadow-md hover:opacity-90 transition-opacity"
                          style={{
                            background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                            boxShadow: `0 4px 16px ${BRAND.teal}40, inset 0 1px 1px rgba(255,255,255,0.2)`,
                          }}
                        >
                          Register
                          <ChevronDown className="h-3.5 w-3.5 opacity-90" />
                        </Button>
                      </motion.div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      sideOffset={16}
                      className="w-72 rounded-3xl border border-border/40 bg-card/95 p-2 shadow-2xl backdrop-blur-xl"
                    >
                      <DropdownMenuLabel className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                        Choose your role
                      </DropdownMenuLabel>

                      <DropdownMenuSeparator className="my-1 bg-border/40" />

                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer rounded-2xl p-0 transition-colors hover:bg-muted/50"
                      >
                        <Link
                          href="/register"
                          className="flex items-center gap-4 px-3 py-3.5"
                        >
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-sm"
                            style={{
                              background: `${BRAND.teal}15`,
                              border: `1px solid ${BRAND.teal}20`,
                            }}
                          >
                            <GraduationCap
                              className="h-5.5 w-5.5"
                              style={{ color: BRAND.teal }}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-foreground">
                              Student Registration
                            </p>
                            <p className="text-[12px] text-muted-foreground/80 mt-0.5">
                              Apply for scholarships
                            </p>
                          </div>
                          <ChevronRight className="h-4.5 w-4.5 text-muted-foreground/50" />
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer rounded-2xl p-0 transition-colors hover:bg-muted/50"
                      >
                        <Link
                          href="/register-admin"
                          className="flex items-center gap-4 px-3 py-3.5 mt-1"
                        >
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-sm bg-teal-100"
                            style={{
                              border: `1px solid ${BRAND.purple}20`,
                            }}
                          >
                            <Shield className="h-5.5 w-5.5 text-[#4b2875] dark:text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-foreground">
                              University Admin
                            </p>
                            <p className="text-[12px] text-muted-foreground/80 mt-0.5">
                              Register your university
                            </p>
                          </div>
                          <ChevronRight className="h-4.5 w-4.5 text-muted-foreground/50" />
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>

            {/* ─── Mobile Menu ─── */}
            <div className="lg:hidden">
              <MobileNav
                userInfo={userInfo}
                dashboardRoute={dashboardRoute}
                onLogout={handleLogout}
                isPending={isPending}
              />
            </div>
          </div>
        </div>
      </motion.header>
    </div>
  );
};

export default NavbarContent;
