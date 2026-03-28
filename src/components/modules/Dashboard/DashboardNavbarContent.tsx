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
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@/lib/authUtils";
import { logoutAction } from "@/services/auth.services";
import { NavSection } from "@/types/dashboard.types";
import { UserInfo } from "@/types/user.types";
import { motion, easeOut, AnimatePresence } from "framer-motion";
import {
  Bell,
  ChevronRight,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  User,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import MobileSidebar from "./MobileSidebar";
import NotificationPopover from "./NotificationPopover";
import { useNotifications } from "@/contexts/NotificationContext";

// ─── Brand ───
const BRAND = {
  teal: "#0097b2",
  purple: "#4b2875",
};

// ─── Breadcrumb Helpers ───
const ROLE_PREFIXES = ["super-admin", "admin", "department-head", "reviewer", "student"];

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Maps for professional breadcrumb labels */
const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  "universities-management": "Universities",
  "users-management": "Users",
  "subscriptions-overview": "Subscriptions",
  "departments-management": "Departments",
  "department-heads-management": "Department Heads",
  "reviewers-management": "Reviewers",
  "invites-management": "Invitations",
  "scholarships-management": "Scholarships",
  "applications-management": "Applications",
  "students-management": "Students",
  "disbursements-management": "Disbursements",
  "academic-levels-management": "Academic Levels",
  "academic-terms-management": "Academic Terms",
  "university-settings": "University Settings",
  subscription: "Subscription",
  screening: "Application Screening",
  students: "Department Students",
  applications: "Review Applications",
  "my-applications": "My Applications",
  "available-scholarships": "Available Scholarships",
  profile: "My Profile",
  "complete-profile": "Complete Profile",
  "academic-info": "Academic Information",
  notifications: "Notifications",
  "change-password": "Change Password",
  "my-profile": "My Profile",
  new: "Create New",
  documents: "Documents",
};

function formatSegment(segment: string): string {
  // Check for a professional label first
  if (BREADCRUMB_LABELS[segment]) {
    return BREADCRUMB_LABELS[segment];
  }
  // Fallback: capitalize words
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  // Skip role prefix
  let startIndex = 0;
  if (segments[0] && ROLE_PREFIXES.includes(segments[0])) {
    startIndex = 1;
  }

  const breadcrumbs: { label: string; href: string; isLast: boolean }[] = [];

  for (let i = startIndex; i < segments.length; i++) {
    const segment = segments[i];
    const href = "/" + segments.slice(0, i + 1).join("/");

    let label: string;
    if (UUID_REGEX.test(segment)) {
      label = "Details";
    } else {
      label = formatSegment(segment);
    }

    breadcrumbs.push({
      label,
      href,
      isLast: i === segments.length - 1,
    });
  }

  return breadcrumbs;
}

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

function getProfileHref(role: UserRole): string {
  switch (role) {
    case "STUDENT":
      return "/student/profile";
    case "SUPER_ADMIN":
      return "/super-admin/my-profile";
    case "UNIVERSITY_ADMIN":
      return "/admin/my-profile";
    case "DEPARTMENT_HEAD":
      return "/department-head/my-profile";
    case "COMMITTEE_REVIEWER":
      return "/reviewer/my-profile";
    default:
      return "/change-password";
  }
}

// ─── Props ───
interface DashboardNavbarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

// ─── Component ───
const DashboardNavbarContent = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardNavbarContentProps) => {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    setMounted(true);
  }, []);

  const breadcrumbs = generateBreadcrumbs(pathname);
  const roleBadgeStyle = getRoleBadgeStyle(userInfo.role);
  const profileHref = getProfileHref(userInfo.role);

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: easeOut }}
      className="sticky top-0 z-30 shrink-0 border-b bg-card/95 backdrop-blur-md"
    >
      {/* Top gradient accent (mobile) */}
      <div
        className="h-0.5 md:hidden"
        style={{
          background: `linear-gradient(90deg, ${BRAND.purple}, ${BRAND.teal}, ${BRAND.purple}40)`,
        }}
      />

      <div className="flex h-14 items-center gap-2 px-3 md:h-16 md:gap-4 md:px-6">
        {/* ═══ Mobile Sidebar Toggle ═══ */}
        <MobileSidebar
          navItems={navItems}
          userInfo={userInfo}
          dashboardHome={dashboardHome}
          onLogout={handleLogout}
        />

        {/* ═══ Breadcrumb (Desktop) ═══ */}
        <nav className="hidden items-center gap-1.5 sm:flex" aria-label="Breadcrumb">
          <Link
            href={dashboardHome}
            className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            Dashboard
          </Link>

          {breadcrumbs
            .filter((crumb) => crumb.label !== "Dashboard")
            .map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                {crumb.isLast ? (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="text-sm font-semibold"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {crumb.label}
                  </motion.span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}

          {breadcrumbs.length === 0 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-semibold"
              style={{
                background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Dashboard
            </motion.span>
          )}
        </nav>

        {/* ═══ Mobile Page Title ═══ */}
        <div className="flex-1 sm:hidden">
          <motion.h1
            key={pathname}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="truncate text-sm font-semibold text-foreground"
          >
            {breadcrumbs[breadcrumbs.length - 1]?.label || "Dashboard"}
          </motion.h1>
        </div>

        {/* ═══ Spacer ═══ */}
        <div className="hidden flex-1 sm:block" />

        {/* ═══ Right Actions ═══ */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* ─── Search Bar ─── */}
          <AnimatePresence mode="wait">
            {isSearchOpen ? (
              <motion.div
                key="search-input"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: easeOut }}
                className="relative hidden items-center overflow-hidden md:flex"
              >
                <div className="absolute left-3.5 flex items-center">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anything..."
                  className="h-10 w-full rounded-xl border bg-muted/40 pl-10 pr-20 text-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/50 focus:bg-background focus:shadow-sm"
                  style={{
                    borderColor: isSearchOpen ? `${BRAND.teal}50` : undefined,
                    boxShadow: isSearchOpen ? `0 0 0 3px ${BRAND.teal}15` : undefined,
                  }}
                />
                {/* Shortcut hint + Close */}
                <div className="absolute right-2.5 flex items-center gap-1.5">
                  <kbd className="hidden rounded-md border bg-muted/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline-block">
                    ESC
                  </kbd>
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="rounded-md p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="search-button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => setIsSearchOpen(true)}
                  className="hidden h-10 cursor-pointer gap-2 rounded-xl border border-transparent bg-muted/40 px-3.5 text-sm text-muted-foreground transition-all duration-200 hover:border-border hover:bg-muted/60 md:flex"
                  title="Search (⌘K)"
                >
                  <Search className="h-4 w-4" />
                  <span className="text-muted-foreground/60">Search...</span>
                  <kbd className="ml-4 hidden rounded-md border bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline-block">
                    ⌘K
                  </kbd>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer rounded-lg text-muted-foreground md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="hidden h-6 opacity-50 md:block" />

          {/* ─── Theme Toggle ─── */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="h-9 w-9 cursor-pointer rounded-xl text-muted-foreground transition-colors hover:text-foreground"
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
                    <Sun className="h-4.5 w-4.5" />
                  ) : (
                    <Moon className="h-4.5 w-4.5" />
                  )}
                </motion.div>
              ) : (
                <div className="h-4.5 w-4.5" />
              )}
            </Button>
          </motion.div>

          {/* ─── Notifications ─── */}
          <NotificationPopover  />

          <Separator orientation="vertical" className="hidden h-6 opacity-50 md:block" />

          {/* ─── User Dropdown ─── */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-1.5 transition-all duration-200 hover:bg-muted/50 md:gap-3 md:px-3"
              >
                {/* Avatar */}
                <div className="relative">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm md:h-9 md:w-9"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                      boxShadow: `0 2px 8px ${BRAND.teal}25`,
                    }}
                  >
                    <span className="text-xs font-bold md:text-sm">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* Online dot */}
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
                </div>

                {/* Name & Role (desktop) */}
                <div className="hidden text-left md:block">
                  <p className="max-w-32.5 truncate text-sm font-semibold leading-tight text-foreground">
                    {userInfo.name}
                  </p>
                  <span
                    className="mt-0.5 inline-block rounded-full px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider"
                    style={roleBadgeStyle}
                  >
                    {userInfo.role.toLowerCase().replace(/_/g, " ")}
                  </span>
                </div>

                <ChevronRight className="hidden h-3.5 w-3.5 rotate-90 text-muted-foreground/60 md:block" />
              </motion.button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-60 rounded-xl border p-1.5 shadow-xl"
            >
              {/* User Header */}
              <DropdownMenuLabel className="px-2 py-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                    }}
                  >
                    <span className="text-base font-bold">
                      {userInfo.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{userInfo.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {userInfo.email}
                    </p>
                    <span
                      className="mt-1 inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider"
                      style={roleBadgeStyle}
                    >
                      {userInfo.role.toLowerCase().replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* Menu Items */}
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5">
                <Link href={profileHref} className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">My Profile</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5">
                <Link href="/notifications" className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span
                      className="ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5">
                <Link href="/change-password" className="flex items-center gap-3">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Change Password</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isPending}
                className="cursor-pointer rounded-lg px-3 py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-950/50 dark:focus:text-red-300"
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
                      <LogOut className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  <span className="text-sm">
                    {isPending ? "Logging out..." : "Logout"}
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Bottom gradient accent */}
      <div
        className="h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${BRAND.teal}15, transparent)`,
        }}
      />
    </motion.header>
  );
};

export default DashboardNavbarContent;
