import { NextRequest, NextResponse } from "next/server";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  isValidRedirectForRole,
  isSubscriptionExemptRoute,
  isWriteRoute,
  UserRole,
  SubscriptionStatus,
} from "./lib/authUtils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function decodeJWTPayload(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const decoded = decodeJWTPayload(token);
  if (!decoded?.exp) return true;
  return decoded.exp < Math.floor(Date.now() / 1000);
}

async function getAdminSubscriptionStatus(
  accessToken: string,
  request: NextRequest,
): Promise<SubscriptionStatus | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

    const response = await fetch(`${baseUrl}/subscriptions/status`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch subscription status:", response.status);
      return null;
    }

    const data = await response.json();

    const status =
      data.data?.status ||
      data.status ||
      data.data?.subscriptionStatus ||
      data.subscriptionStatus ||
      data.data?.admin?.subscriptionStatus ||
      data.admin?.subscriptionStatus ||
      "INACTIVE";

    return status as SubscriptionStatus;
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return "INACTIVE";
  }
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname, searchParams } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;

    // ── 1. Decode Access Token ─────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let decoded: Record<string, any> | null = null;
    let isValid = false;
    let userRole: UserRole | null = null;

    if (accessToken) {
      decoded = decodeJWTPayload(accessToken);
      if (decoded?.role && !isTokenExpired(accessToken)) {
        isValid = true;
        userRole = decoded.role as UserRole;
      }
    }

    const routeOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // ── 2. /verify-email (BEFORE general auth redirect) ────
    if (pathname === "/verify-email") {
      if (isValid && userRole && decoded) {
        if (decoded.emailVerified === false) {
          return NextResponse.next();
        }
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole), request.url),
        );
      }
      return NextResponse.next();
    }

    // ── 3. Auth route + logged in → dashboard ──────────────
    if (isAuth && isValid && userRole) {
      const redirectPath = request.nextUrl.searchParams.get("redirect");
      if (redirectPath && isValidRedirectForRole(redirectPath, userRole)) {
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole), request.url),
      );
    }

    // ── 4. Auth route + NOT logged in → allow ──────────────
    if (isAuth && !isValid) {
      return NextResponse.next();
    }

    // ── 5. Public route → allow ────────────────────────────
    if (routeOwner === null) {
      return NextResponse.next();
    }

    // ── 5.5 Stripe return — allow even if token expired ────
    // When user returns from Stripe, access token may have expired.
    // If they still have a refresh token, let the page load.
    // The httpClient will auto-refresh the access token.
    if (
      pathname === "/admin/subscription" &&
      (searchParams.has("success") ||
        searchParams.has("canceled") ||
        searchParams.has("session_id"))
    ) {
      const refreshToken = request.cookies.get("refreshToken")?.value;
      if (refreshToken) {
        // ✅ Allow Stripe return page to load; httpClient will refresh token if needed
        return NextResponse.next();
      }
      // ✅ Even if no refreshToken, allow page to load (user can re-login if needed)
      // This prevents premature redirect to login before Stripe callback completes
      return NextResponse.next();
    }

    // ── 6. Protected route + NOT logged in → login ─────────
    if (!isValid || !userRole || !decoded) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // ── 7. Enforcement: email verification ─────────────────
    if (decoded.emailVerified === false) {
      const verifyUrl = new URL("/verify-email", request.url);
      verifyUrl.searchParams.set("email", decoded.email);
      return NextResponse.redirect(verifyUrl);
    }

    // ── 8. Common protected route → allow ──────────────────
    if (routeOwner === "COMMON") {
      return NextResponse.next();
    }

    // ── 9. Role mismatch → own dashboard ───────────────────
    if (routeOwner !== userRole) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole), request.url),
      );
    }

    // ── 10. Subscription enforcement for UNIVERSITY_ADMIN ──
    if (userRole === "UNIVERSITY_ADMIN" && accessToken) {
      const subscriptionStatus = await getAdminSubscriptionStatus(accessToken, request);

      const response = NextResponse.next();
      if (subscriptionStatus) {
        response.headers.set("x-subscription-status", subscriptionStatus);
      }

      // 10a. INACTIVE → block everything except subscription page
      if (subscriptionStatus === "INACTIVE") {
        if (isSubscriptionExemptRoute(pathname)) {
          return response;
        }
        const subscriptionUrl = new URL("/admin/subscription", request.url);
        subscriptionUrl.searchParams.set("alert", "subscription-required");
        return NextResponse.redirect(subscriptionUrl);
      }

      // 10b. EXPIRED/CANCELLED → read-only mode
      if (subscriptionStatus === "EXPIRED" || subscriptionStatus === "CANCELLED") {
        if (isWriteRoute(pathname)) {
          const dashboardUrl = new URL("/admin/dashboard", request.url);
          dashboardUrl.searchParams.set("alert", "subscription-expired");
          dashboardUrl.searchParams.set("action", "blocked");
          return NextResponse.redirect(dashboardUrl);
        }
        return response;
      }

      // 10c. ACTIVE → full access
      if (subscriptionStatus === "ACTIVE") {
        return response;
      }
    }

    // ── 11. Role match → allow ─────────────────────────────
    return NextResponse.next();
  } catch (error) {
    console.error("Proxy middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
