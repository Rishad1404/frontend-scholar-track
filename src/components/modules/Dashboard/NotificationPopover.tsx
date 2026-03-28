"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  getRecentNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/services/notification.service";
import { INotification, NotificationType } from "@/types/notification.types";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  ChevronRight,
  ClipboardCheck,
  Eye,
  FileText,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  Banknote,
  Megaphone,
  Mail,
  Building2,
  ShieldAlert,
  Sparkles,
  Loader2,
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
}

const NOTIFICATION_CONFIG: Record<NotificationType, NotificationConfig> = {
  APPLICATION_SUBMITTED: {
    icon: FileText,
    color: "#0097b2",
    bgColor: "#0097b215",
  },
  APPLICATION_SCREENING_PASSED: {
    icon: ClipboardCheck,
    color: "#22c55e",
    bgColor: "#22c55e15",
  },
  APPLICATION_SCREENING_REJECTED: {
    icon: XCircle,
    color: "#ef4444",
    bgColor: "#ef444415",
  },
  APPLICATION_UNDER_REVIEW: {
    icon: Eye,
    color: "#f59e0b",
    bgColor: "#f59e0b15",
  },
  APPLICATION_APPROVED: {
    icon: ThumbsUp,
    color: "#22c55e",
    bgColor: "#22c55e15",
  },
  APPLICATION_REJECTED: {
    icon: ThumbsDown,
    color: "#ef4444",
    bgColor: "#ef444415",
  },
  DISBURSEMENT_PROCESSED: {
    icon: Banknote,
    color: "#10b981",
    bgColor: "#10b98115",
  },
  SCHOLARSHIP_PUBLISHED: {
    icon: Sparkles,
    color: "#8b5cf6",
    bgColor: "#8b5cf615",
  },
  INVITE_RECEIVED: {
    icon: Mail,
    color: "#0097b2",
    bgColor: "#0097b215",
  },
  UNIVERSITY_APPROVED: {
    icon: Building2,
    color: "#22c55e",
    bgColor: "#22c55e15",
  },
  UNIVERSITY_SUSPENDED: {
    icon: ShieldAlert,
    color: "#ef4444",
    bgColor: "#ef444415",
  },
  SYSTEM_ANNOUNCEMENT: {
    icon: Megaphone,
    color: "#4b2875",
    bgColor: "#4b287515",
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
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: easeOut },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.15 },
  },
};

const NotificationPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const router = useRouter();

  const { unreadCount, decrementUnreadCount, resetUnreadCount } =
    useNotifications();

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getRecentNotifications(6);
      setNotifications(Array.isArray(data) ? data : []);
    } catch {
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  const handleMarkSingleAsRead = async (notification: INotification) => {
    if (notification.isRead) return;

    setMarkingId(notification.id);
    try {
      const result = await markNotificationAsRead(notification.id);

      if (result !== null) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        decrementUnreadCount();
      }
    } finally {
      setMarkingId(null);
    }
  };

  const handleViewDetails = async (notification: INotification) => {
    if (!notification.isRead) {
      await handleMarkSingleAsRead(notification);
    }

    setIsOpen(false);

    if (notification.link) {
      router.push(notification.link);
    } else {
      router.push(`/notifications/${notification.id}`);
    }
  };

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

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadNotifications = safeNotifications.filter((n) => !n.isRead);
  const hasUnread = unreadNotifications.length > 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 cursor-pointer rounded-xl text-muted-foreground transition-colors hover:text-foreground"
            title="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />

            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                  }}
                  className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                    boxShadow: `0 2px 8px ${BRAND.teal}40`,
                  }}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </motion.span>
              )}
            </AnimatePresence>

            {unreadCount > 0 && (
              <span
                className="absolute -right-0.5 -top-0.5 h-4.5 w-4.5 animate-ping rounded-full opacity-20"
                style={{ background: BRAND.teal }}
              />
            )}
          </Button>
        </motion.div>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-97.5 rounded-xl border p-0 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Notifications</h3>
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                  }}
                >
                  {unreadCount} new
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {hasUnread && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAll}
              className="h-7 cursor-pointer gap-1.5 rounded-lg px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              {isMarkingAll ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <CheckCheck className="h-3 w-3" />
              )}
              Mark all read
            </Button>
          )}
        </div>

        <Separator />

        {/* Notification List */}
        <ScrollArea className="max-h-110">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Loader2 className="h-6 w-6" style={{ color: BRAND.teal }} />
              </motion.div>
            </div>
          ) : safeNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center gap-3 py-12"
            >
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ background: `${BRAND.teal}10` }}
              >
                <BellOff
                  className="h-7 w-7"
                  style={{ color: `${BRAND.teal}60` }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  All caught up!
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  No new notifications right now
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="py-1"
            >
              <AnimatePresence>
                {safeNotifications.map((notification) => {
                  const config =
                    NOTIFICATION_CONFIG[notification.type] ||
                    NOTIFICATION_CONFIG.SYSTEM_ANNOUNCEMENT;
                  const Icon = config.icon;
                  const isMarkingThis = markingId === notification.id;

                  return (
                    <motion.div
                      key={notification.id}
                      variants={itemVariants}
                      exit="exit"
                      layout
                    >
                      <div className="px-4 py-3 transition-colors duration-150 hover:bg-muted/40">
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div
                            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                            style={{ background: config.bgColor }}
                          >
                            <Icon
                              className="h-4 w-4"
                              style={{ color: config.color }}
                            />
                          </div>

                          {/* Content */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={`text-sm leading-tight ${
                                  notification.isRead
                                    ? "font-normal text-foreground/80"
                                    : "font-semibold text-foreground"
                                }`}
                              >
                                {notification.title}
                              </p>

                              {!notification.isRead && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                                  style={{
                                    background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                                  }}
                                />
                              )}
                            </div>

                            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                              {notification.message}
                            </p>

                            <div className="mt-1.5 flex items-center gap-2">
                              <span className="text-[10px] text-muted-foreground/60">
                                {timeAgo(notification.createdAt)}
                              </span>

                              {!notification.isRead && (
                                <span
                                  className="rounded-full px-1.5 py-px text-[9px] font-medium"
                                  style={{
                                    background: config.bgColor,
                                    color: config.color,
                                  }}
                                >
                                  New
                                </span>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-3 flex items-center gap-2">
                              {!notification.isRead && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={isMarkingThis}
                                  onClick={() =>
                                    handleMarkSingleAsRead(notification)
                                  }
                                  className="h-7 cursor-pointer rounded-lg px-2.5 text-xs"
                                >
                                  {isMarkingThis ? (
                                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                  ) : (
                                    <Check className="mr-1 h-3 w-3" />
                                  )}
                                  Mark as read
                                </Button>
                              )}

                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(notification)}
                                className="h-7 cursor-pointer rounded-lg px-2.5 text-xs"
                                style={{ color: BRAND.teal }}
                              >
                                View details
                                <ChevronRight className="ml-1 h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </ScrollArea>

        {/* Footer */}
        {safeNotifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/notifications");
                }}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
                style={{ color: BRAND.teal }}
              >
                <span>View All Notifications</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;