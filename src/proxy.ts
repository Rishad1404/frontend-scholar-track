import { NextRequest, NextResponse } from "next/server";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  isValidRedirectForRole,
  UserRole,
} from "./lib/authUtils";

// ─── EDGE-SAFE JWT DECODER (decode only, no verification) ───
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

// ─── Check if token is expired based on `exp` claim ───
function isTokenExpired(token: string): boolean {
  const decoded = decodeJWTPayload(token);
  if (!decoded?.exp) return true;
  return decoded.exp < Math.floor(Date.now() / 1000);
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
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
    //    Prevents infinite loop:
    //      dashboard → enforcement → /verify-email → auth rule → dashboard → ∞
    if (pathname === "/verify-email") {
      if (isValid && userRole && decoded) {
        if (decoded.emailVerified === false) {
          return NextResponse.next();
        }
        // Already verified → dashboard
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole), request.url),
        );
      }
      // Not logged in → allow (verify-email form page)
      return NextResponse.next();
    }

    // ── 3. Auth route + logged in → dashboard ──────────────
    if (isAuth && isValid && userRole) {
      // Honour ?redirect= if valid for the user's role
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

    // ── 10. Role match → allow ─────────────────────────────
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