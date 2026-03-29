/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  getRecentNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/services/notification.services";
import { INotification, NotificationType } from "@/types/notification.types";
import { motion, easeOut } from "framer-motion";
import {
  Bell,
  BellOff,
  CheckCheck,
  ChevronRight,
  FileText,
  ClipboardCheck,
  XCircle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Banknote,
  Megaphone,
  Mail,
  Building2,
  ShieldAlert,
  Sparkles,
  Loader2,
  Filter,
  Archive,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// ─── Brand ───
const BRAND = {
  teal: "#0097b2",
  purple: "#4b2875",
};

// ─── Notification Type Config ───
interface NotificationConfig {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  label: string;
}

const NOTIFICATION_CONFIG: Record<NotificationType, NotificationConfig> = {
  APPLICATION_SUBMITTED: {
    icon: FileText,
    color: "#0097b2",
    bgColor: "#0097b215",
    label: "Application Submitted",
  },
  APPLICATION_SCREENING_PASSED: {
    icon: ClipboardCheck,
    color: "#22c55e",
    bgColor: "#22c55e15",
    label: "Screening Passed",
  },
  APPLICATION_SCREENING_REJECTED: {
    icon: XCircle,
    color: "#ef4444",
    bgColor: "#ef444415",
    label: "Screening Rejected",
  },
  APPLICATION_UNDER_REVIEW: {
    icon: Eye,
    color: "#f59e0b",
    bgColor: "#f59e0b15",
    label: "Under Review",
  },
  APPLICATION_APPROVED: {
    icon: ThumbsUp,
    color: "#22c55e",
    bgColor: "#22c55e15",
    label: "Approved",
  },
  APPLICATION_REJECTED: {
    icon: ThumbsDown,
    color: "#ef4444",
    bgColor: "#ef444415",
    label: "Rejected",
  },
  DISBURSEMENT_PROCESSED: {
    icon: Banknote,
    color: "#10b981",
    bgColor: "#10b98115",
    label: "Disbursement",
  },
  SCHOLARSHIP_PUBLISHED: {
    icon: Sparkles,
    color: "#8b5cf6",
    bgColor: "#8b5cf615",
    label: "Scholarship Published",
  },
  INVITE_RECEIVED: {
    icon: Mail,
    color: "#0097b2",
    bgColor: "#0097b215",
    label: "Invite",
  },
  UNIVERSITY_APPROVED: {
    icon: Building2,
    color: "#22c55e",
    bgColor: "#22c55e15",
    label: "University Approved",
  },
  UNIVERSITY_SUSPENDED: {
    icon: ShieldAlert,
    color: "#ef4444",
    bgColor: "#ef444415",
    label: "University Suspended",
  },
  SYSTEM_ANNOUNCEMENT: {
    icon: Megaphone,
    color: "#4b2875",
    bgColor: "#4b287515",
    label: "System Announcement",
  },
};

// ─── Time Ago Helper ───
function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Animation Variants ───
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: easeOut },
  },
};

// ─── Component ───
const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    INotification[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [selectedType, setSelectedType] = useState<NotificationType | "all">(
    "all"
  );
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const router = useRouter();

  const {  resetUnreadCount, decrementUnreadCount } =
    useNotifications();

  // ─── Fetch all notifications ───
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getRecentNotifications(50); // Get more for the full page
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Apply filters ───
  useEffect(() => {
    let filtered = [...notifications];

    // Tab filter
    if (activeTab === "unread") {
      filtered = filtered.filter((n) => !n.isRead);
    } else if (activeTab === "read") {
      filtered = filtered.filter((n) => n.isRead);
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((n) => n.type === selectedType);
    }

    setFilteredNotifications(filtered);
  }, [notifications, activeTab, selectedType]);

  // ─── Initial fetch ───
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ─── Handle notification click ───
  const handleNotificationClick = async (notification: INotification) => {
    if (!notification.isRead) {
      const success = await markNotificationAsRead(notification.id);
      if (success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        decrementUnreadCount();
      }
    }

    if (notification.link) {
      router.push(notification.link);
    } else {
      router.push(`/notifications/${notification.id}`);
    }
  };

  // ─── Mark all as read ───
  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    try {
      const success = await markAllNotificationsAsRead();
      if (success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        resetUnreadCount();
      }
    } finally {
      setIsMarkingAll(false);
    }
  };

  // ─── Stats ───
  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  const typeCounts = notifications.reduce(
    (acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    },
    {} as Record<NotificationType, number>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* ═══ Header ───────────────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
              <p className="text-muted-foreground">
                Manage your notifications and stay updated
              </p>
            </div>

            <div className="flex items-center gap-2">
              {unreadNotifications.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleMarkAllAsRead}
                  disabled={isMarkingAll}
                  className="gap-2"
                >
                  {isMarkingAll ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCheck className="h-4 w-4" />
                  )}
                  Mark all as read
                </Button>
              )}
              <Button
                variant="outline"
                onClick={fetchNotifications}
                disabled={isLoading}
                className="gap-2"
              >
                <Archive className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ═══ Stats Cards ─────────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.purple}15, ${BRAND.teal}15)`,
                    }}
                  >
                    <Bell className="h-6 w-6" style={{ color: BRAND.teal }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{notifications.length}</p>
                    <p className="text-xs text-muted-foreground">
                      All notifications
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Unread
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.purple}15, ${BRAND.teal}15)`,
                    }}
                  >
                    <Bell className="h-6 w-6" style={{ color: BRAND.purple }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {unreadNotifications.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requires attention
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Read
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND.purple}15, ${BRAND.teal}15)`,
                    }}
                  >
                    <CheckCheck className="h-6 w-6" style={{ color: "#22c55e" }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{readNotifications.length}</p>
                    <p className="text-xs text-muted-foreground">
                      Already viewed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <Separator />

        {/* ═══ Filters & Tabs ──────────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Type Filter */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Filter className="h-4 w-4" />
                  Filter by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedType === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType("all")}
                    className="text-xs"
                    style={
                      selectedType === "all"
                        ? {
                            background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                          }
                        : undefined
                    }
                  >
                    All Types
                  </Button>
                  {Object.entries(NOTIFICATION_CONFIG).map(([type, config]) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(type as NotificationType)}
                      className="gap-1.5 text-xs"
                      style={
                        selectedType === type
                          ? {
                              background: config.bgColor,
                              color: config.color,
                              borderColor: `${config.color}30`,
                            }
                          : undefined
                      }
                    >
                      <config.icon className="h-3 w-3" />
                      {config.label}
                      <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
                        {typeCounts[type as NotificationType] || 0}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Card className="lg:w-64">
              <CardHeader>
                <CardTitle className="text-sm">View</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => setActiveTab(v as any)}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all" className="text-xs">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="text-xs">
                      Unread
                    </TabsTrigger>
                    <TabsTrigger value="read" className="text-xs">
                      Read
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* ═══ Notifications List ──────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {activeTab === "all"
                    ? "All Notifications"
                    : activeTab === "unread"
                    ? "Unread Notifications"
                    : "Read Notifications"}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({filteredNotifications.length})
                  </span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                  >
                    <Loader2
                      className="h-8 w-8"
                      style={{ color: BRAND.teal }}
                    />
                  </motion.div>
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-12">
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-full"
                    style={{ background: `${BRAND.teal}10` }}
                  >
                    <BellOff
                      className="h-10 w-10"
                      style={{ color: `${BRAND.teal}60` }}
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">No notifications</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {activeTab === "unread"
                        ? "You're all caught up! No unread notifications."
                        : "No notifications match your filters."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredNotifications.map((notification) => {
                    const config =
                      NOTIFICATION_CONFIG[notification.type] ||
                      NOTIFICATION_CONFIG.SYSTEM_ANNOUNCEMENT;
                    const Icon = config.icon;

                    return (
                      <motion.div
                        key={notification.id}
                        variants={itemVariants}
                        layout
                      >
                        <button
                          onClick={() => handleNotificationClick(notification)}
                          className="group flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200 hover:border-border hover:bg-muted/30"
                        >
                          {/* Icon */}
                          <div
                            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105"
                            style={{
                              background: config.bgColor,
                            }}
                          >
                            <Icon
                              className="h-5 w-5"
                              style={{ color: config.color }}
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <h4
                                  className={`text-sm font-medium ${
                                    notification.isRead
                                      ? "text-foreground/80"
                                      : "text-foreground"
                                  }`}
                                >
                                  {notification.title}
                                </h4>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {notification.message}
                                </p>
                              </div>

                              <div className="flex shrink-0 items-center gap-2">
                                {!notification.isRead && (
                                  <span
                                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                                    style={{
                                      background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                                    }}
                                  >
                                    New
                                  </span>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {timeAgo(notification.createdAt)}
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center gap-3">
                              <span
                                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                                style={{
                                  background: config.bgColor,
                                  color: config.color,
                                }}
                              >
                                {config.label}
                              </span>
                              {notification.link && (
                                <span className="text-xs text-muted-foreground">
                                  Click to view details →
                                </span>
                              )}
                            </div>
                          </div>

                          <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-1" />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotificationsPage;