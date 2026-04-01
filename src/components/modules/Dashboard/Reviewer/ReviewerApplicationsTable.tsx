/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, LayoutGrid } from "lucide-react";
import { getAllApplications } from "@/services/application.services";
import { IApplication } from "@/types/application";
import DataTable from "@/components/shared/table/DataTable";
import SubmitReviewModal from "./SubmitReviewModal";
import { applicationColumns } from "../Application/applicationColumns";
import ViewApplicationDialog from "../Application/ViewApplicationDialog";

export default function ReviewerApplicationsTable({ searchParamsPromise }: any) {
  const resolvedSearchParams = use(searchParamsPromise);
  const queryString = new URLSearchParams(resolvedSearchParams as any).toString() || "status=UNDER_REVIEW";

  // 🚨 STATE 1: For reading the full application details
  const [viewItem, setViewItem] = useState<IApplication | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // 🚨 STATE 2: For actually submitting the 0-10 scores
  const [scoreItem, setScoreItem] = useState<IApplication | null>(null);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ["reviewer-applications", queryString],
    queryFn: () => getAllApplications(queryString),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Star className="h-8 w-8 text-amber-500 fill-amber-500" />
          Review Queue
        </h1>
        <p className="text-muted-foreground font-medium">Evaluate and score scholarship applicants assigned to your committee.</p>
      </div>

      <div className="rounded-[2rem] border border-border/40 bg-card shadow-xl overflow-hidden p-6">
        <DataTable
          data={response?.data || []}
          columns={applicationColumns}
          isLoading={isLoading}
          meta={response?.meta}
          actions={{
            // The "Eye" icon opens the detailed view
            onView: (item) => {
              setViewItem(item);
              setIsViewModalOpen(true);
            },
            // The "Edit/Pen" icon is a shortcut to just open the scoring form
            onEdit: (item) => {
              setScoreItem(item);
              setIsScoreModalOpen(true);
            }
          }}
        />
      </div>

      {/* ─── 1. The Detail Viewer ─── */}
      <ViewApplicationDialog
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        application={viewItem}
        onRefresh={() => refetch()}
        // This connects the amber button at the bottom of the View Dialog 
        // to open the Scoring Modal!
        onEvaluate={(app) => {
          setScoreItem(app);
          setIsScoreModalOpen(true);
        }}
      />

      {/* ─── 2. The Scoring Form ─── */}
      <SubmitReviewModal
        open={isScoreModalOpen}
        onOpenChange={setIsScoreModalOpen}
        applicationId={scoreItem?.id || ""}
        studentName={scoreItem?.student?.user?.name || ""}
        onSuccess={() => refetch()}
      />
    </div>
  );
}