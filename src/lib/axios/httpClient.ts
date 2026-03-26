/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ApiResponse } from "@/types/api.types";
import { isTokenExpiringSoon } from "../tokenUtils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API_BASE_URL is not defined");
}

/**
 * Try to refresh tokens by calling the backend refresh endpoint.
 *
 * Note: we DON'T call any Next cookies().set helpers here because
 * cookies().set is only allowed in Server Actions or Route Handlers.
 * Instead we return the new tokens so the caller (server branch of
 * axiosInstance) can use them for the immediate request (Authorization
 * header and Cookie header) without persisting them via Next's cookie API.
 */
async function tryRefreshToken(accessToken: string, refreshToken: string): Promise<{
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
        // send the refreshToken in the Cookie header as some backends expect
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!res.ok) {
      return null;
    }

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
 * - On the server we need to read cookies() and inject Cookie header so
 *   the backend receives authentication.
 * - On the client (browser) we rely on the browser to send auth cookies and
 *   set withCredentials: true so cross-site cookies are included when needed.
 */
const axiosInstance = async () => {
  // If window is undefined => server-side
  if (typeof window === "undefined") {
    // server
  const headersMod = await import("next/headers");
  const cookieStore = await headersMod.cookies();

    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // Attempt to refresh tokens if access token is expiring. We don't persist
    // any refreshed tokens to Next's cookies here (cookies().set is restricted
    // to server actions/route handlers). Instead we use refreshed tokens for
    // this request only.
    let refreshedTokens = null;
    if (accessToken && refreshToken) {
      refreshedTokens = await tryRefreshToken(accessToken, refreshToken);
    }

    // Build Cookie header by taking existing cookies and overriding any
    // token values with refreshed ones when available.
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
          if (cookie.name === "better-auth.session_token" && refreshedTokens.sessionToken) {
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

    // Attach Authorization header from refreshed token (or existing token)
    if (refreshedTokens?.accessToken) {
      serverHeaders["Authorization"] = `Bearer ${refreshedTokens.accessToken}`;
    } else if (accessToken) {
      serverHeaders["Authorization"] = `Bearer ${accessToken}`;
    }

    const instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: serverHeaders,
    });

    return instance;
  }

  // client (browser)
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
    // allow browser to include cookies for auth (if API is same-site or CORS allows)
    withCredentials: true,
  });

  return instance;
};

export interface ApiRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

const httpGet = async <TData>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance =await axiosInstance();
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

const httpPost = async <TData>(
  endpoint: string,
  data?: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance=await axiosInstance();
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

const httpPut = async <TData>(
  endpoint: string,
  data?: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance=await axiosInstance();
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

const httpPatch = async <TData>(
  endpoint: string,
  data?: unknown,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance=await axiosInstance();
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

const httpDelete = async <TData>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance=await axiosInstance();
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
