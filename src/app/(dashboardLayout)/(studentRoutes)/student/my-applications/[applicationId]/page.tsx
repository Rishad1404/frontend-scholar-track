import ApplicationDetails from "@/components/modules/Dashboard/Students/Applications/ApplicationDetails";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Details | Scholar Track",
  description: "View the details and status of your scholarship application.",
};

export default async function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ApplicationDetails applicationId={applicationId} />
    </div>
  );
}