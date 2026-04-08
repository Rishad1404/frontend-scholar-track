"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface NotificationContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  decrementUnreadCount: () => void;
  resetUnreadCount: () => void;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  setUnreadCount: () => {},
  decrementUnreadCount: () => {},
  resetUnreadCount: () => {},
  refreshUnreadCount: async () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({
  children,
  initialCount = 0,
}: {
  children: React.ReactNode;
  initialCount?: number;
}) => {
  const [unreadCount, setUnreadCount] = useState(initialCount);

  const decrementUnreadCount = useCallback(() => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const resetUnreadCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/notifications/unread-count`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) return;
      const json = await res.json();
      setUnreadCount(json?.data?.unreadCount ?? json?.data?.count ?? 0);
    } catch {
      // silently fail
    }
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
        decrementUnreadCount,
        resetUnreadCount,
        refreshUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};