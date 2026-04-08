/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ApiResponse } from "@/types/api.types";
import { isTokenExpiringSoon } from "../tokenUtils";

// 1. SMART URL: Full URL for Server, Proxy URL for Browser
const isServer = typeof window === "undefined";
const API_BASE_URL = isServer
  ? "https://backend-scholar-track.vercel.app/api/v1"
  : "/api/v1";

/**
 * Try to refresh tokens by calling the backend refresh endpoint.
 */
async function tryRefreshToken(
  accessToken: string,
  refreshToken: string,
): Promise<{
  accessToken?: string;
  refreshToken?: string;
  sessionToken?: string;
} | null> {
  if (!isTokenExpiringSoon(accessToken)) {
    return null;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!res.ok) return null;

    const json = await res.json();
    const data = json?.data ?? json;

    return {
      accessToken: data?.accessToken ?? data?.access_token ?? data?.token,
      refreshToken: data?.refreshToken ?? data?.refresh_token,
      sessionToken: data?.sessionToken ?? data?.session_token,
    };
  } catch (error) {
    console.log("Error refreshing token", error);
    return null;
  }
}

/**
 * Create an axios instance appropriate to the runtime.
 */
const axiosInstance = async () => {
  if (isServer) {
    try {
      // 2. CRASH-PROOF SERVER COOKIES: Wrapped in try/catch to prevent Next.js render errors
      const headersMod = await import("next/headers");
      const cookieStore = await headersMod.cookies();

      const accessToken = cookieStore.get("accessToken")?.value;
      const refreshToken = cookieStore.get("refreshToken")?.value;

      let refreshedTokens = null;
      if (accessToken && refreshToken) {
        refreshedTokens = await tryRefreshToken(accessToken, refreshToken);
      }

      const cookieHeader = cookieStore
        .getAll()
        .map((cookie: any) => {
          if (refreshedTokens) {
            if (cookie.name === "accessToken" && refreshedTokens.accessToken) {
              return `accessToken=${refreshedTokens.accessToken}`;
            }
            if (cookie.name === "refreshToken" && refreshedTokens.refreshToken) {
              return `refreshToken=${refreshedTokens.refreshToken}`;
            }
            if (
              (cookie.name === "better-auth.session_token" ||
                cookie.name === "__Secure-better-auth.session_token") &&
              refreshedTokens.sessionToken
            ) {
              return `better-auth.session_token=${refreshedTokens.sessionToken}`;
            }
          }
          return `${cookie.name}=${cookie.value}`;
        })
        .join("; ");

      const serverHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      };

      if (refreshedTokens?.accessToken) {
        serverHeaders["Authorization"] = `Bearer ${refreshedTokens.accessToken}`;
      } else if (accessToken) {
        serverHeaders["Authorization"] = `Bearer ${accessToken}`;
      }

      return axios.create({
        baseURL: API_BASE_URL,
        timeout: 30000,
        headers: serverHeaders,
      });
    } catch (e) {
      // Fallback for Next.js static rendering phase
      return axios.create({
        baseURL: API_BASE_URL,
        timeout: 30000,
      });
    }
  }

  // 3. CLIENT (BROWSER) LOGIC
  return axios.create({
    baseURL: API_BASE_URL, // This resolves to "/api/v1"
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // Tells Chrome to send cookies to the proxy
  });
};

export interface ApiRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

const httpGet = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.get<ApiResponse<TData>>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.log(`GET request to ${endpoint} error`, error);
    throw error;
  }
};

const httpPost = async <TData>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`POST request to ${endpoint} error`, error);
    throw error;
  }
};

const httpPut = async <TData>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.put<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`PUT request to ${endpoint} error`, error);
    throw error;
  }
};

const httpPatch = async <TData>(endpoint: string, data?: unknown, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`PATCH request to ${endpoint} error`, error);
    throw error;
  }
};

const httpDelete = async <TData>(endpoint: string, options?: ApiRequestOptions): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response = await instance.delete<ApiResponse<TData>>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });
    return response.data;
  } catch (error) {
    console.error(`DELETE request to ${endpoint} error`, error);
    throw error;
  }
};

export const httpClient = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
};