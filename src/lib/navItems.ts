import { NavSection } from "@/types/dashboard.types";
import { getDefaultDashboardRoute, UserRole } from "./authUtils";

// ─── Helper: Role-specific profile route ───
function getProfileRoute(role: UserRole): string {
  switch (role) {
    case "STUDENT":
      return "/student/profile";
    case "SUPER_ADMIN":
      return "/super-admin/my-profile";
    case "UNIVERSITY_ADMIN":
      return "/admin/my-profile";
    case "DEPARTMENT_HEAD":
      return "/department-head/my-profile";
    case "COMMITTEE_REVIEWER":
      return "/reviewer/my-profile";
    default:
      return "/change-password";
  }
}

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);
  const profileRoute = getProfileRoute(role);

  return [
    {
      items: [
        {
          title: "Home",
          href: "/",
          icon: "Home",
        },
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "LayoutDashboard",
        },
        {
          title: "Notifications",
          href: "/notifications",
          icon: "Bell",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "My Profile",
          href: profileRoute,
          icon: "User",
        },
        {
          title: "Change Password",
          href: "/change-password",
          icon: "KeyRound",
        },
      ],
    },
  ];
};

// ══════════════════════════════════════════════════════════
//  ROLE SPECIFIC NAV ITEMS
// ══════════════════════════════════════════════════════════

export const superAdminNavItems: NavSection[] = [
  {
    title: "Platform Management",
    items: [
      {
        title: "Universities",
        href: "/super-admin/universities-management",
        icon: "Building2",
      },
      {
        title: "Users",
        href: "/super-admin/users-management",
        icon: "Users",
      },
      {
        title: "Subscriptions",
        href: "/super-admin/subscriptions-overview",
        icon: "CreditCard",
      },
    ],
  },
];

export const universityAdminNavItems: NavSection[] = [
  {
    title: "University Setup",
    items: [
      {
        title: "Departments",
        href: "/admin/departments-management",
        icon: "Network",
      },
      {
        title: "Academic Levels",
        href: "/admin/academic-levels-management",
        icon: "Layers",
      },
      {
        title: "Academic Terms",
        href: "/admin/academic-terms-management",
        icon: "Calendar",
      },
      {
        title: "University Settings",
        href: "/admin/university-settings",
        icon: "Settings",
      },
    ],
  },
  {
    title: "Staff Management",
    items: [
      {
        title: "Dept. Heads",
        href: "/admin/department-heads-management",
        icon: "UserCog",
      },
      {
        title: "Reviewers",
        href: "/admin/reviewers-management",
        icon: "Star",
      },
      {
        title: "Invitations",
        href: "/admin/invites-management",
        icon: "MailPlus",
      },
    ],
  },
  {
    title: "Scholarship & Students",
    items: [
      {
        title: "Scholarships",
        href: "/admin/scholarships-management",
        icon: "BookOpen",
      },
      {
        title: "Applications",
        href: "/admin/applications-management",
        icon: "FileText",
      },
      {
        title: "Students",
        href: "/admin/students-management",
        icon: "GraduationCap",
      },
      {
        title: "Disbursements",
        href: "/admin/disbursements-management",
        icon: "Banknote",
      },
    ],
  },
  {
    title: "Billing",
    items: [
      {
        title: "Subscription",
        href: "/admin/subscription",
        icon: "Receipt",
      },
    ],
  },
];

export const departmentHeadNavItems: NavSection[] = [
  {
    title: "Department",
    items: [
      {
        title: "Screening",
        href: "/department-head/screening",
        icon: "ClipboardCheck",
      },
      {
        title: "Students",
        href: "/department-head/students",
        icon: "Users",
      },
    ],
  },
];

export const committeeReviewerNavItems: NavSection[] = [
  {
    title: "Reviews",
    items: [
      {
        title: "Applications",
        href: "/committee-reviewer/applications",
        icon: "FileSearch",
      },
    ],
  },
];

export const studentNavItems: NavSection[] = [
  {
    title: "My Account",
    items: [
      {
        title: "My Applications",
        href: "/student/my-applications",
        icon: "FileText",
      },
      {
        title: "Available Scholarships",
        href: "/student/available-scholarships",
        icon: "Sparkles",
      },
      {
        title: "Academic Info",
        href: "/student/academic-info",
        icon: "BookOpen",
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════
//  MAIN EXPORT
// ══════════════════════════════════════════════════════════

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "SUPER_ADMIN":
      return [...commonNavItems, ...superAdminNavItems];

    case "UNIVERSITY_ADMIN":
      return [...commonNavItems, ...universityAdminNavItems];

    case "DEPARTMENT_HEAD":
      return [...commonNavItems, ...departmentHeadNavItems];

    case "COMMITTEE_REVIEWER":
      return [...commonNavItems, ...committeeReviewerNavItems];

    case "STUDENT":
      return [...commonNavItems, ...studentNavItems];

    default:
      return commonNavItems;
  }
};