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
import { motion, easeOut } from "framer-motion";
import { LogOut, Menu, ChevronRight } from "lucide-react";
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
    transition: { staggerChildren: 0.03, delayChildren: 0.1 },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: easeOut },
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
          className="h-8 w-8 shrink-0 cursor-pointer rounded-lg text-muted-foreground md:hidden"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Menu className="h-5 w-5" />
          </motion.div>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-70 p-0">
        <div className="flex h-full flex-col">
          {/* ═══ Header ═══ */}
          <SheetHeader className="border-b p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <Link href={dashboardHome} onClick={handleNavClick}>
              <div
                className="flex h-16 items-center gap-3 px-5"
                style={{
                  background: `linear-gradient(135deg, ${BRAND.purple}08, ${BRAND.teal}08)`,
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
              </div>
            </Link>

            {/* Gradient accent */}
            <div
              className="h-0.5"
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
              className="space-y-5 px-3 py-4"
            >
              {navItems.map((section, sectionId) => (
                <motion.div key={sectionId} variants={navItemVariants}>
                  {/* Section Title */}
                  {section.title && (
                    <div className="mb-2 flex items-center gap-2 px-3">
                      <div
                        className="h-px flex-1"
                        style={{
                          background: `linear-gradient(90deg, ${BRAND.teal}25, transparent)`,
                        }}
                      />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
                        {section.title}
                      </span>
                      <div
                        className="h-px flex-1"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${BRAND.teal}25)`,
                        }}
                      />
                    </div>
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
                            <div
                              className={cn(
                                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                  ? "text-white shadow-md"
                                  : "text-muted-foreground hover:text-foreground"
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

                              <Icon
                                className={cn(
                                  "relative z-10 h-4.5 w-4.5 shrink-0 transition-colors duration-200",
                                  isActive
                                    ? "text-white"
                                    : "text-muted-foreground group-hover:text-foreground"
                                )}
                              />
                              <span className="relative z-10 flex-1">
                                {item.title}
                              </span>

                              {!isActive && (
                                <ChevronRight className="relative z-10 h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-50" />
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  {sectionId < navItems.length - 1 && (
                    <div className="pt-3">
                      <Separator className="opacity-50" />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.nav>
          </ScrollArea>

          {/* ═══ User Info + Logout ═══ */}
          <div className="shrink-0 border-t">
            <div
              className="h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${BRAND.teal}20, transparent)`,
              }}
            />

            <div className="px-3 py-3.5">
              <div className="flex items-center gap-3 rounded-xl p-2.5">
                {/* Avatar */}
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ring-2 ring-offset-1 ring-offset-card"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                  }}
                >
                  <span className="text-sm font-bold">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Name & Role */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {userInfo.name}
                  </p>
                  <span
                    className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={roleBadgeStyle}
                  >
                    {userInfo.role.toLowerCase().replace(/_/g, " ")}
                  </span>
                </div>

                {/* Logout */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    handleNavClick();
                    onLogout();
                  }}
                  className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;