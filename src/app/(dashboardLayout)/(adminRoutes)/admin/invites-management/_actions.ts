/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getCookie } from "@/lib/cookieUtils";
import { IDepartment } from "@/types/invites.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchUniversityId(): Promise<string | undefined> {
  const token =
    (await getCookie("accessToken")) ||
    (await getCookie("token")) ||
    (await getCookie("better-auth.session_token"));

  if (!token || !BASE_URL) return undefined;

  try {
    const res = await fetch(`${BASE_URL}/stats/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return undefined;

    const json = await res.json();

    const university =
      json?.data?.university || json?.data?.data?.university;

    return university?.id;
  } catch (error) {
    console.error("Failed to fetch universityId:", error);
    return undefined;
  }
}

export async function fetchDepartments(
  universityId?: string
): Promise<IDepartment[]> {
  const token =
    (await getCookie("accessToken")) ||
    (await getCookie("token")) ||
    (await getCookie("better-auth.session_token"));

  if (!BASE_URL) return [];

  const url = universityId
    ? `${BASE_URL}/departments/university/${universityId}`
    : `${BASE_URL}/departments`;

  try {
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Departments fetch failed:", res.status, res.statusText);
      return [];
    }

    const json = await res.json();

    console.log("Departments raw response:", JSON.stringify(json, null, 2));

    const data =
      json?.data?.data ??
      json?.data ??
      json?.departments ??
      json;

    if (!Array.isArray(data)) return [];

    // Map to IDepartment — ensure universityId is always a string
    return data.map((dept: any) => ({
      id: dept.id,
      name: dept.name,
      universityId: dept.universityId || universityId || "",
    }));
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    return [];
  }
}