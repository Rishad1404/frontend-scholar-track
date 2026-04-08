// src/app/(commonLayout)/scholarships/[id]/page.tsx

import ScholarshipDetail from "@/components/modules/PublicScholarship/ScholarshipDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scholarship Details | ScholarTrack",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ScholarshipDetailPage({ params }: Props) {
  const { id } = await params;
  return <ScholarshipDetail scholarshipId={id} />;
}