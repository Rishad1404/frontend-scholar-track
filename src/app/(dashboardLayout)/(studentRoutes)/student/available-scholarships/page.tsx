// app/(dashboardLayout)/(studentRoutes)/student/scholarships/page.tsx

import { redirect } from "next/navigation";
import { getUserInfo } from "@/services/auth.services";
import AvailableScholarships from "@/components/modules/Dashboard/Students/Scholarships/AvailableScholarships";

export default async function StudentScholarshipsPage() {
  const currentUser = await getUserInfo();
  if (!currentUser) redirect("/login");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <AvailableScholarships />
    </div>
  );
}