export interface NavItem {
  title: string;
  href: string;
  icon: string;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface PieChartData {
  status: string;
  count: number;
}

export interface BarChartData {
  month: Date | string;
  count: number;
}

// ─── Super Admin Dashboard ──────────────────────────────

export interface ISuperAdminDashboardData {
  totalUsers: number;
  totalUniversities: number;
  totalStudents: number;
  totalScholarships: number;
  totalApplications: number;
  totalDisbursements: number;
  activeUniversities: number;
  pendingUniversities: number;
  totalDisbursedAmount: number;
  totalSubscriptionRevenue: number;
  roleDistribution: PieChartData[];
  universityStatusDistribution: PieChartData[];
  applicationStatusDistribution: PieChartData[];
  userStatusDistribution: PieChartData[];
  monthlyApplications: BarChartData[];
  monthlyRevenue: BarChartData[];
}

// ─── University Admin Dashboard ─────────────────────────

export interface IUniversityAdminDashboardData {
  totalStudents: number;
  totalDepartments: number;
  totalScholarships: number;
  totalApplications: number;
  totalDepartmentHeads: number;
  totalReviewers: number;
  pendingScreeningCount: number;
  pendingReviewCount: number;
  pendingDisbursementCount: number;
  totalDisbursedAmount: number;
  applicationStatusDistribution: PieChartData[];
  scholarshipStatusDistribution: PieChartData[];
  studentAcademicStatusDistribution: PieChartData[]; 
  monthlyApplications: BarChartData[];
  topScholarships: {
    id: string;
    title: string;
    applicationCount: number;
  }[];
}

// ─── Department Head Dashboard ──────────────────────────

export interface IDepartmentHeadDashboardData {
  totalStudentsInDept: number;
  totalScholarshipsForDept: number;
  pendingScreeningCount: number;
  screeningPassed: number;
  screeningRejected: number;
  screeningPassRate: number;
  applicationStatusDistribution: PieChartData[];
  academicStatusDistribution: PieChartData[];
}

// ─── Committee Reviewer Dashboard ───────────────────────

export interface ICommitteeReviewerDashboardData {
  totalReviews: number;
  pendingReviews: number;
  reviewedCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  scoreBreakdown: {
    category: string;
    averageScore: number;
  }[];
  scoreDistribution: PieChartData[]; 
}

// ─── Student Dashboard ──────────────────────────────────

export interface IStudentDashboardData {
  draftApplications: number;
  inProgressApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  disbursedApplications: number;
  availableScholarships: number;
  totalReceivedAmount: number;
  academicInfo: {
    university: string;
    department: string;
    level: string;
    term: string;
    gpa: number;
    academicStatus: string;
  } | null;
  applicationStatusDistribution: PieChartData[];
  recentApplications: {
    id: string;
    scholarshipTitle: string;
    status: string;
    submittedAt: Date | string;
  }[];
}