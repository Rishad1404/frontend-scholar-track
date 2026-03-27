import ResetPasswordForm from "@/components/modules/Auth/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | ScholarTrack",
  description: "Create a new password for your ScholarTrack account.",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const email = params.email || "";

  return (
  <ResetPasswordForm email={email} />
);
}
