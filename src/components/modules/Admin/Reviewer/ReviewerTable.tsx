// src/components/modules/Dashboard/Reviewer/ReviewerTable.tsx

"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Users2 } from "lucide-react";

import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { getAllReviewers } from "@/services/reviewer.services";
import { getAllDepartments } from "@/services/department.services";
import type { IReviewer } from "@/types/reviewer";
import type { PaginationMeta } from "@/types/api.types";

import { reviewerColumns } from "./reviewerColumns";
import EditReviewerModal from "./EditReviewerModal";
import DeleteReviewerDialog from "./DeleteReviewerDialog";
import ViewReviewerDialog from "./ViewReviewerDialog";
import { CreateInviteDialog } from "../InviteManagement";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default function ReviewerTable() {
  const searchParams = useSearchParams();

  const {
    viewingItem,
    editingItem,
    deletingItem,
    isViewDialogOpen,
    isEditModalOpen,
    isDeleteDialogOpen,
    onViewOpenChange,
    onEditOpenChange,
    onDeleteOpenChange,
    tableActions,
  } = useRowActionModalState<IReviewer>();

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

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["reviewers", queryStringFromUrl],
    queryFn: () => getAllReviewers(queryStringFromUrl),
  });

  const { data: departmentData } = useQuery({
    queryKey: ["departments-for-invite"],
    queryFn: () => getAllDepartments(),
    staleTime: 1000 * 60 * 10,
  });

  const reviewers: IReviewer[] = data?.data ?? [];
  const meta: PaginationMeta | undefined = data?.meta;


const departments = (departmentData?.data ?? []).map((dept) => ({
  id: dept.id,
  name: dept.name,
  universityId: dept.universityId,
}));

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Users2 className="h-7 w-7 text-primary" />
            Committee Reviewers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Invite and manage committee reviewers for your university.
          </p>
        </div>
      </div>

      <DataTable
        data={reviewers}
        columns={reviewerColumns}
        isLoading={isLoading || isFetching || isRouteRefreshPending}
        emptyMessage="No reviewers found."
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
          placeholder: "Search reviewers by name, email, expertise...",
          debounceMs: 700,
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        toolbarAction={
          <CreateInviteDialog departments={departments} />
        }
        meta={meta}
        actions={tableActions}
      />

      <ViewReviewerDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        reviewer={viewingItem}
      />

      <EditReviewerModal
        open={isEditModalOpen}
        onOpenChange={onEditOpenChange}
        reviewer={editingItem}
        onSuccess={() => refetch()}
      />

      <DeleteReviewerDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        reviewer={deletingItem}
        onSuccess={() => refetch()}
      />
    </>
  );
}