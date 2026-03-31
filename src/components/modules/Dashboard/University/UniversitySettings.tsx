/* eslint-disable react/no-unescaped-entities */
// src/components/modules/Dashboard/University/UniversitySettings.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

import { getUniversityById } from "@/services/university.services";
import { getUserInfo } from "@/services/auth.services";
import UniversityInfoCard from "./UniversityInfoCard";
import UniversityStatsCard from "./UniversityStatsCard";
import UniversityEditForm from "./UniversityEditForm";

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

export default function UniversitySettings() {
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: getUserInfo,
  });

  const universityId = userData?.admin?.universityId;

  const {
    data: universityData,
    isLoading: isUniLoading,
    refetch,
  } = useQuery({
    queryKey: ["university", universityId],
    queryFn: () => getUniversityById(universityId!),
    enabled: !!universityId,
  });

  const university = universityData?.data;
  const isLoading = isUserLoading || isUniLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/30">
          <Loader2 
            className="h-8 w-8 animate-spin" 
            style={{ color: BRAND_TEAL }} 
          />
          <div 
            className="absolute inset-0 rounded-2xl border-t-2 border-transparent opacity-20 animate-spin-slow"
            style={{ borderTopColor: BRAND_PURPLE }}
          />
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Loading university profile...
        </p>
      </div>
    );
  }

  if (!university) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[50vh] flex-col items-center justify-center text-center"
      >
        <div className="mb-4 rounded-full bg-rose-500/10 p-4">
          <AlertCircle className="h-10 w-10 text-rose-500" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          University Not Found
        </h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          We couldn't locate your university profile. Please contact support if you believe this is an error.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      // Expanded width for a grander full-page experience
      className="max-w-300 w-full mx-auto space-y-10 pb-16"
    >
      {/* 1. Grand Profile Header */}
      <UniversityInfoCard university={university} />

      {/* 2. Full-Width Stats Card */}
      {university._count && (
        <div className="w-full">
          <UniversityStatsCard counts={university._count} />
        </div>
      )}

      {/* 3. Full-Width Edit Form Area */}
      <div className="rounded-[2rem] border border-border/50 bg-card shadow-sm overflow-hidden">
        {/* Decorative top border mapping to your brand */}
        <div 
          className="h-1.5 w-full" 
          style={{ background: `linear-gradient(90deg, ${BRAND_TEAL}, ${BRAND_PURPLE})` }} 
        />
        <div className="p-4 sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground">Update Profile Settings</h2>
            <p className="text-sm text-muted-foreground">Modify your institution's public information and logo.</p>
          </div>
          <UniversityEditForm university={university} onSuccess={() => refetch()} />
        </div>
      </div>
      
    </motion.div>
  );
}