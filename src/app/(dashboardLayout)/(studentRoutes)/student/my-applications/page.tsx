import MyApplications from "@/components/modules/Dashboard/Students/Applications/MyAplications";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Applications | Scholar Track",
  description: "Track your scholarship applications and drafts.",
};

export default function MyApplicationsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <MyApplications />
    </div>
  );
}