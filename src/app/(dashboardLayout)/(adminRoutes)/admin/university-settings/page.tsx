// src/app/(dashboardLayout)/(adminRoutes)/admin/university-settings/page.tsx

import UniversitySettings from "@/components/modules/Dashboard/University/UniversitySettings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "University Settings | Scholar Track",
  description: "Manage your university information",
};

export default function UniversitySettingsPage() {
  return <UniversitySettings />;
}