"use server";

import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;
  return {
    "Content-Type": "application/json",
    Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken || ""}`,
  };
}

export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_API_URL}/notifications/unread-count`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
    if (!res.ok) return 0;
    const { data } = await res.json();
    return data?.count ?? 0;
  } catch {
    return 0;
  }
}

export async function getRecentNotifications(limit = 5) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${BASE_API_URL}/notifications?limit=${limit}&sortBy=createdAt&sortOrder=desc`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    const json = await res.json();

    const data = json?.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;

    return [];
  } catch {
    return [];
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_API_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers,
    });
    if (!res.ok) return null;
    const { data } = await res.json();
    return data;
  } catch {
    return null;
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_API_URL}/notifications/mark-all-read`, {
      method: "PATCH",
      headers,
    });
    if (!res.ok) return false;
    return true;
  } catch {
    return false;
  }
}
