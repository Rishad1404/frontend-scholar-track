// components/modules/Dashboard/Students/AcademicInfo/AcademicInfoWrapper.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

import { getStudentMyProfile } from "@/services/student.services";
import type { IStudentMyProfile } from "@/types/student";
import { Skeleton } from "@/components/ui/skeleton";
import AcademicInfoView from "../AcademicInfo/AcademicInfoView";

export default function AcademicInfoWrapper() {
  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery<{ success: boolean; data: IStudentMyProfile }>({
    queryKey: ["student-my-profile"],
    queryFn: () => getStudentMyProfile(),
  });

  const profile = response?.data;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[50vh] flex-col items-center justify-center text-center"
      >
        <div className="mb-4 rounded-full bg-rose-500/10 p-4">
          <AlertCircle className="h-10 w-10 text-rose-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Profile Not Found
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Please complete your profile first before adding academic information.
        </p>
      </motion.div>
    );
  }

  return <AcademicInfoView profile={profile} onUpdate={() => refetch()} />;
}