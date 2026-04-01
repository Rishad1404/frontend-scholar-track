// src/components/modules/Dashboard/Applications/ApplicationsTable.tsx

"use client";

import { use, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ListChecks, Filter, X } from "lucide-react";

import { getAllApplications } from "@/services/application.services";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { IApplication, APPLICATION_STATUS_LABELS } from "@/types/application";
import { PaginationMeta } from "@/types/api.types";
import DataTable from "@/components/shared/table/DataTable";

import { applicationColumns } from "./applicationColumns";
import ViewApplicationDialog from "./ViewApplicationDialog";
import AiEvaluateModal from "./AiEvaluatedModal";
import DecisionModal from "./DecisionModal";

import { toast } from "sonner";

// UI Components for the Filter
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createDisbursementAction } from "@/app/(dashboardLayout)/(adminRoutes)/admin/applications-management/_actions";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default function ApplicationsTable({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<Record<string, string | string[]>>;
}) {
  const resolvedSearchParams = use(searchParamsPromise);
  const initialQueryString = new URLSearchParams(
    resolvedSearchParams as Record<string, string>,
  ).toString();

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    viewingItem,
    isViewDialogOpen,
    onViewOpenChange,
    tableActions,
  } = useRowActionModalState<IApplication>();

  const [aiItem, setAiItem] = useState<IApplication | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const [decisionItem, setDecisionItem] = useState<IApplication | null>(null);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);

  const handleOpenAiModal = (application: IApplication) => {
    onViewOpenChange(false);
    setTimeout(() => {
      setAiItem(application);
      setIsAiModalOpen(true);
    }, 150);
  };

  const handleOpenDecisionModal = (application: IApplication) => {
    onViewOpenChange(false);
    setTimeout(() => {
      setDecisionItem(application);
      setIsDecisionModalOpen(true);
    }, 150);
  };

  const handleCreateDisbursement = async (application: IApplication) => {
    const toastId = toast.loading("Sending to payout queue...");
    const res = await createDisbursementAction(application.id);

    if (res.success) {
      toast.success(res.message, { id: toastId });
      refetch(); // Instantly update the table
    } else {
      toast.error(res.message, { id: toastId });
    }
  };

  // ─── Filter Logic ───
  const currentStatusFilter = searchParams.get("status") || "all";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset to page 1 when filtering
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("status");
    // Add any other filter keys here to delete them
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters = currentStatusFilter !== "all";

  const {
    queryStringFromUrl,
    optimisticSortingState,
    optimisticPaginationState,
    isRouteRefreshPending,
    updateParams,
    handleSortingChange,
    handlePaginationChange,
  } = useServerManagedDataTable({
    searchParams,
    defaultPage: DEFAULT_PAGE,
    defaultLimit: DEFAULT_LIMIT,
  });

  const queryString = queryStringFromUrl || initialQueryString;

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  const {
    data: applicationsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["applications", queryString],
    queryFn: () => getAllApplications(queryString),
  });

  const applications: IApplication[] = applicationsResponse?.data ?? [];
  const meta: PaginationMeta | undefined = applicationsResponse?.meta;

  return (
    <>
      {/* ─── Premium Page Header ─── */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-foreground">
            <ListChecks
              className="h-8 w-8 text-primary"
              style={{ color: "#0097b2" }}
            />
            Applications Management
          </h1>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            View, evaluate, and manage all scholarship applications in your university.
          </p>
        </div>
      </div>

      {/* ─── Premium Filter & Table Card ─── */}
      <div className="rounded-[2rem] border border-border/40 bg-card shadow-xl shadow-foreground/5 overflow-hidden">
        
        {/* Filter Toolbar */}
        <div className="border-b border-border/40 bg-muted/10 px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Filter className="h-4 w-4 text-primary" style={{ color: "#4b2875" }} />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-foreground">
              Filter Records
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <Select 
              value={currentStatusFilter} 
              onValueChange={(v) => handleFilterChange("status", v)}
            >
              <SelectTrigger className="w-45 h-10 rounded-xl border-border/60 bg-background shadow-sm font-semibold">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="font-semibold">All Statuses</SelectItem>
                {Object.entries(APPLICATION_STATUS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="font-semibold">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters Button (Animated) */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="h-10 rounded-xl px-4 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-colors font-bold border border-rose-500/20"
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="p-4 sm:p-6 pt-2">
          <DataTable
            data={applications}
            columns={applicationColumns}
            isLoading={isLoading || isFetching || isRouteRefreshPending}
            emptyMessage="No applications found matching your criteria."
            sorting={{
              state: optimisticSortingState,
              onSortingChange: handleSortingChange,
            }}
            pagination={{
              state: optimisticPaginationState,
              onPaginationChange: handlePaginationChange,
            }}
            search={{
              initialValue: searchTermFromUrl,
              placeholder: "Search by essay content or scholarship title...",
              debounceMs: 700,
              onDebouncedChange: handleDebouncedSearchChange,
            }}
            meta={meta}
            actions={{
              ...tableActions,
              onEdit: (item) => {
                setDecisionItem(item);
                setIsDecisionModalOpen(true);
              },
            }}
          />
        </div>
      </div>

      {/* Modals */}
      <ViewApplicationDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        application={viewingItem}
        onAiEvaluate={handleOpenAiModal}
        onMakeDecision={handleOpenDecisionModal}
        onCreateDisbursement={handleCreateDisbursement}
        onRefresh={() => refetch()}
      />

      <AiEvaluateModal
        open={isAiModalOpen}
        onOpenChange={setIsAiModalOpen}
        application={aiItem}
        onSuccess={() => refetch()}
      />

      <DecisionModal
        open={isDecisionModalOpen}
        onOpenChange={setIsDecisionModalOpen}
        application={decisionItem}
        onSuccess={() => refetch()}
      />
    </>
  );
}