/* eslint-disable react/no-unescaped-entities */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNotifications } from "@/contexts/NotificationContext";
import { markNotificationAsRead } from "@/services/notification.services";
import { INotification, NotificationType } from "@/types/notification.types";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
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
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ─── Brand ───
const BRAND = {
  teal: "#0097b2",
  purple: "#4b2875",
};

// ─── Notification Type Config ───
const NOTIFICATION_CONFIG: Record<
  NotificationType,
  { icon: React.ElementType; color: string; label: string }
> = {
  APPLICATION_SUBMITTED: {
    icon: FileText,
    color: "#0097b2",
    label: "Application Submitted",
  },
  APPLICATION_SCREENING_PASSED: {
    icon: ClipboardCheck,
    color: "#22c55e",
    label: "Screening Passed",
  },
  APPLICATION_SCREENING_REJECTED: {
    icon: XCircle,
    color: "#ef4444",
    label: "Screening Rejected",
  },
  APPLICATION_UNDER_REVIEW: {
    icon: Eye,
    color: "#f59e0b",
    label: "Under Review",
  },
  APPLICATION_APPROVED: {
    icon: ThumbsUp,
    color: "#22c55e",
    label: "Approved",
  },
  APPLICATION_REJECTED: {
    icon: ThumbsDown,
    color: "#ef4444",
    label: "Rejected",
  },
  DISBURSEMENT_PROCESSED: {
    icon: Banknote,
    color: "#10b981",
    label: "Disbursement",
  },
  SCHOLARSHIP_PUBLISHED: {
    icon: Sparkles,
    color: "#8b5cf6",
    label: "Scholarship Published",
  },
  INVITE_RECEIVED: {
    icon: Mail,
    color: "#0097b2",
    label: "Invite",
  },
  UNIVERSITY_APPROVED: {
    icon: Building2,
    color: "#22c55e",
    label: "University Approved",
  },
  UNIVERSITY_SUSPENDED: {
    icon: ShieldAlert,
    color: "#ef4444",
    label: "University Suspended",
  },
  SYSTEM_ANNOUNCEMENT: {
    icon: Megaphone,
    color: "#4b2875",
    label: "System Announcement",
  },
};

// ─── Format Date ───
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Component ───
const NotificationDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [notification, setNotification] = useState<INotification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { decrementUnreadCount } = useNotifications();

  // ─── Fetch notification details ───
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        // TODO: Replace with actual API call to fetch single notification
        // For now, we'll simulate by fetching all and finding the matching one
        const res = await fetch(`/api/v1/notifications/${id}`, {
          credentials: "include",
        });
        if (res.ok) {
          const json = await res.json();
          setNotification(json.data);

          // Mark as read if not already
          if (json.data && !json.data.isRead) {
            await markNotificationAsRead(id as string);
            decrementUnreadCount();
          }
        }
      } catch {
        // Handle error
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchNotification();
    }
  }, [id, decrementUnreadCount]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-[#0097b2]" />
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-xl font-semibold">Notification not found</h2>
            <p className="mt-2 text-muted-foreground">
              The notification you're looking for doesn't exist or has been deleted.
            </p>
            <Button asChild className="mt-6">
              <Link href="/notifications">Back to Notifications</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const config =
    NOTIFICATION_CONFIG[notification.type] || NOTIFICATION_CONFIG.SYSTEM_ANNOUNCEMENT;
  const Icon = config.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6 gap-2">
          <Link href="/notifications">
            <ArrowLeft className="h-4 w-4" />
            Back to Notifications
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{
                    background: `${config.color}15`,
                  }}
                >
                  <Icon className="h-6 w-6" style={{ color: config.color }} />
                </div>
                <div>
                  <CardTitle className="text-xl">{notification.title}</CardTitle>
                  <div className="mt-1 flex items-center gap-3">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        background: `${config.color}15`,
                        color: config.color,
                      }}
                    >
                      {config.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {notification.link && (
                <Button variant="outline" size="sm" asChild className="gap-2">
                  <Link href={notification.link}>
                    View Details
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              )}
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            {/* Message */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Message
              </h3>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {notification.message}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Notification Details
                </h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span
                      className={`font-medium ${
                        notification.isRead ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {notification.isRead ? "Read" : "Unread"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{config.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Received:</span>
                    <span className="font-medium">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </h3>
                <div className="space-y-2">
                  {!notification.isRead && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={async () => {
                        await markNotificationAsRead(notification.id);
                        decrementUnreadCount();
                        router.refresh();
                      }}
                    >
                      <FileText className="h-4 w-4" />
                      Mark as Read
                    </Button>
                  )}
                  {notification.link && (
                    <Button
                      variant="default"
                      className="w-full justify-start gap-2"
                      style={{
                        background: `linear-gradient(135deg, ${BRAND.purple}, ${BRAND.teal})`,
                      }}
                      asChild
                    >
                      <Link href={notification.link}>
                        <ExternalLink className="h-4 w-4" />
                        Go to Related Page
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                    <Link href="/notifications">
                      <ArrowLeft className="h-4 w-4" />
                      Back to All Notifications
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotificationDetailPage;
