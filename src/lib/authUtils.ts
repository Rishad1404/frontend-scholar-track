export type UserRole =
  | "SUPER_ADMIN"
  | "UNIVERSITY_ADMIN"
  | "DEPARTMENT_HEAD"
  | "COMMITTEE_REVIEWER"
  | "STUDENT";

export type SubscriptionStatus = 
  | "INACTIVE"
  | "ACTIVE"
  | "EXPIRED"
  | "CANCELLED";

export const authRoutes = [
  "/login",
  "/register",
  "/register-admin",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/accept-invite",
];

export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((route: string) => pathname.startsWith(route));
};

export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

// Routes accessible by ALL logged-in users
export const commonProtectedRoutes: RouteConfig = {
  exact: ["/change-password", "/notifications"],
  pattern: [/^\/notifications\/.+/],
};

export const superAdminProtectedRoutes: RouteConfig = {
  pattern: [/^\/super-admin/],
  exact: [],
};

export const universityAdminProtectedRoutes: RouteConfig = {
  pattern: [/^\/admin/],
  exact: [],
};

export const departmentHeadProtectedRoutes: RouteConfig = {
  pattern: [/^\/department-head/],
  exact: [],
};

export const committeeReviewerProtectedRoutes: RouteConfig = {
  pattern: [/^\/reviewer/],
  exact: [],
};

export const studentProtectedRoutes: RouteConfig = {
  pattern: [/^\/student/],
  exact: [],
};


export const subscriptionExemptRoutes: RouteConfig = {
  exact: [
    "/admin/subscription",
    "/admin/my-profile",
  ],
  pattern: [],
};

// Routes that require WRITE access (blocked for EXPIRED/CANCELLED)
export const adminWriteRoutes: RouteConfig = {
  exact: [
    "/admin/scholarships-management/create",
    "/admin/departments-management/create",
    "/admin/department-heads-management/add",
    "/admin/reviewers-management/add",
    "/admin/invites-management/send",
    "/admin/disbursements-management/create",
    "/admin/academic-levels-management/create",
    "/admin/academic-terms-management/create",
  ],
  pattern: [
    /^\/admin\/.*\/edit$/,        // Any edit route
    /^\/admin\/.*\/delete$/,      // Any delete route
    /^\/admin\/.*\/approve$/,     // Any approve route
    /^\/admin\/.*\/reject$/,      // Any reject route
    /^\/admin\/.*\/publish$/,     // Any publish route
    /^\/admin\/applications-management\/.*\/decision$/, // Application decisions
  ],
};

// Check if route is exempt from subscription requirement
export const isSubscriptionExemptRoute = (pathname: string): boolean => {
  return isRouteMatches(pathname, subscriptionExemptRoutes);
};

// Check if route requires write permissions
export const isWriteRoute = (pathname: string): boolean => {
  return isRouteMatches(pathname, adminWriteRoutes);
};


export const isRouteMatches = (pathname: string, routes: RouteConfig) => {
  if (routes.exact.includes(pathname)) {
    return true;
  }
  return routes.pattern.some((pattern: RegExp) => pattern.test(pathname));
};

export const getRouteOwner = (pathname: string): UserRole | "COMMON" | null => {
  if (isRouteMatches(pathname, superAdminProtectedRoutes)) return "SUPER_ADMIN";
  if (isRouteMatches(pathname, universityAdminProtectedRoutes)) return "UNIVERSITY_ADMIN";
  if (isRouteMatches(pathname, departmentHeadProtectedRoutes)) return "DEPARTMENT_HEAD";
  if (isRouteMatches(pathname, committeeReviewerProtectedRoutes))
    return "COMMITTEE_REVIEWER";
  if (isRouteMatches(pathname, studentProtectedRoutes)) return "STUDENT";
  if (isRouteMatches(pathname, commonProtectedRoutes)) return "COMMON";

  return null;
};

export const getDefaultDashboardRoute = (role: UserRole) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "/super-admin/dashboard";
    case "UNIVERSITY_ADMIN":
      return "/admin/dashboard";
    case "DEPARTMENT_HEAD":
      return "/department-head/dashboard";
    case "COMMITTEE_REVIEWER":
      return "/reviewer/dashboard";
    case "STUDENT":
      return "/student/dashboard";
    default:
      return "/login";
  }
};

export const isValidRedirectForRole = (redirectPath: string, role: UserRole) => {
  const routeOwner = getRouteOwner(redirectPath);
  
  if (routeOwner === null || routeOwner === "COMMON") {
    return true;
  }
  
  return routeOwner === role;
};