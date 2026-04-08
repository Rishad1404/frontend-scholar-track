
import UniversityDetail from "@/components/modules/PublicUniversity/UniversityDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "University Details | ScholarTrack",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UniversityDetailPage({ params }: Props) {
  const { id } = await params;
  return <UniversityDetail universityId={id} />;
}