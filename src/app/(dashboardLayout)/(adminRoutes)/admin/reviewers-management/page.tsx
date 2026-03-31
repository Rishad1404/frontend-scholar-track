// src/app/(dashboardLayout)/(adminRoutes)/admin/reviewers-management/page.tsx

import ReviewerTable from "@/components/modules/Admin/Reviewer/ReviewerTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviewer Management | Scholar Track",
  description: "Manage committee reviewers",
};

export default function ReviewerManagementPage() {
  return <ReviewerTable />;
}