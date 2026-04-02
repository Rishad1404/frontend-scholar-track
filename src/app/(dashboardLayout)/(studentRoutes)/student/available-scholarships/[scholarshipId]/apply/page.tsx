
import { redirect } from "next/navigation";
import { getUserInfo } from "@/services/auth.services";
import ApplyScholarship from "@/components/modules/Dashboard/Students/Scholarships/ApplyScholarship";

interface Props {
  params: Promise<{ scholarshipId: string }>;
}

export default async function ApplyScholarshipPage({ params }: Props) {
  const { scholarshipId } = await params;
  const currentUser = await getUserInfo();
  if (!currentUser) redirect("/login");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <ApplyScholarship scholarshipId={scholarshipId} />
    </div>
  );
}