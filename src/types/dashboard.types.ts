export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}
export interface ChartItem {
  name: string;
  value: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface RoleDistribution {
  role: string;
  count: number;
}

export interface MonthlyCount {
  month: string; // ISO string after JSON parse
  count: number;
}

export interface MonthlyRevenue {
  month: string;
  total: number;
}

// ═══════════════════════════════════════════
// TOP SCHOLARSHIP (Admin)
// ═══════════════════════════════════════════

export interface TopScholarship {
  id: string;
  title: string;
  quota: number;
  amountPerStudent: number;
  status: string;
  applicationCount: number;
}

// ═══════════════════════════════════════════
// SUPER ADMIN DASHBOARD
// ═══════════════════════════════════════════

export interface SuperAdminDashboardStats {
  counts: {
    totalUsers: number;
    totalUniversities: number;
    activeUniversities: number;
    pendingUniversities: number;
    totalStudents: number;
    totalScholarships: number;
    activeScholarships: number;
    totalApplications: number;
    totalDisbursements: number;
    activeUsers: number;
    bannedUsers: number;
    deletedUsers: number;
  };
  financials: {
    totalDisbursedAmount: number;
    totalSubscriptionRevenue: number;
  };
  charts: {
    roleDistribution: RoleDistribution[];
    universityStatusDistribution: StatusDistribution[];
    userStatusDistribution: StatusDistribution[];
    applicationStatusPie: StatusDistribution[];
    monthlyApplications: MonthlyCount[];
    monthlyRevenue: MonthlyRevenue[];
  };
}

// ═══════════════════════════════════════════
// UNIVERSITY ADMIN DASHBOARD
// ═══════════════════════════════════════════

export interface AdminDashboardData {
  university: {
    id: string;
    name: string;
    status: string;
  };
  subscriptionStatus: string;
  counts: {
    totalStudents: number;
    totalDepartments: number;
    totalScholarships: number;
    activeScholarships: number;
    totalApplications: number;
    totalDeptHeads: number;
    totalReviewers: number;
    totalDisbursements: number;
    pendingScreening: number;
    pendingReview: number;
    approvedApplications: number;
    pendingDisbursements: number;
    regularStudents: number;
    probationStudents: number;
    suspendedStudents: number;
    droppedOutStudents: number;
    activeUsersInUni: number;
    bannedUsersInUni: number;
  };
  financials: {
    totalDisbursedAmount: number;
  };
  charts: {
    applicationStatusDistribution: StatusDistribution[];
    scholarshipStatusDistribution: StatusDistribution[];
    academicStatusDistribution: StatusDistribution[];
    monthlyApplications: MonthlyCount[];
  };
  topScholarships: TopScholarship[];
}

// ═══════════════════════════════════════════
// DEPARTMENT HEAD DASHBOARD
// ═══════════════════════════════════════════

export interface SuperAdminDashboardData {
  counts: {
    totalUsers: number;
    totalUniversities: number;
    activeUniversities: number;
    pendingUniversities: number;
    totalStudents: number;
    totalScholarships: number;
    activeScholarships: number;
    totalApplications: number;
    totalDisbursements: number;
    activeUsers: number;
    bannedUsers: number;
    deletedUsers: number;
  };
  financials: {
    totalDisbursedAmount: number;
    totalSubscriptionRevenue: number;
  };
  charts: {
    roleDistribution: RoleDistribution[];
    universityStatusDistribution: StatusDistribution[];
    userStatusDistribution: StatusDistribution[];
    applicationStatusPie: StatusDistribution[];
    monthlyApplications: MonthlyCount[];
    monthlyRevenue: MonthlyRevenue[];
  };
}

// ═══════════════════════════════════════════
// COMMITTEE REVIEWER DASHBOARD
// ═══════════════════════════════════════════

export interface ReviewerDashboardData {
  university: {
    id: string;
    name: string;
  };
  counts: {
    totalReviews: number;
    pendingReviewApplications: number;
    reviewedApplications: number;
  };
  scores: {
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    maxPossibleScore: number;
  };
  scoreBreakdown: {
    avgGpaScore: number;
    avgEssayScore: number;
    avgFinancialScore: number;
    avgCriteriaScore: number;
  };
  charts: {
    scoreDistribution: {
      excellent: number;
      good: number;
      average: number;
      poor: number;
    };
  };
}



// ═══════════════════════════════════════════
// STUDENT DASHBOARD
// ═══════════════════════════════════════════

export interface RecentApplication {
  id: string;
  status: string;
  submittedAt: string | null;
  createdAt: string;
  scholarship: {
    id: string;
    title: string;
    amountPerStudent: number;
    deadline: string;
  };
}

export interface StudentDashboardData {
  university: {
    id: string;
    name: string;
  } | null;
  academicInfo: {
    id: string;
    studentIdNo: string | null;
    gpa: number;
    cgpa: number;
    creditHoursCompleted: number;
    academicStatus: string;
    department: { id: string; name: string };
    level: { id: string; name: string };
    term: { id: string; name: string };
  } | null;
  counts: {
    totalApplications: number;
    draftApplications: number;
    inProgressApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    disbursedApplications: number;
    availableScholarships: number;
  };
  financials: {
    totalReceivedAmount: number;
  };
  charts: {
    applicationStatusDistribution: StatusDistribution[];
  };
  recentApplications: RecentApplication[];
}



// ═══════════════════════════════════════════
// DEPARTMENT HEAD DASHBOARD — matches backend exactly
// ═══════════════════════════════════════════

export interface DepartmentHeadDashboardData {
  department: {
    id: string;
    name: string;
  };
  university: {
    id: string;
    name: string;
  };
  counts: {
    totalStudentsInDept: number;
    totalScholarshipsForDept: number;
    activeScholarshipsForDept: number;
    pendingScreening: number;
    totalScreened: number;
    screeningPassed: number;
    screeningRejected: number;
  };
  screeningRate: number;
  charts: {
    applicationStatusDistribution: StatusDistribution[];
    academicStatusDistribution: StatusDistribution[];
  };
}