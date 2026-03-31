"use client";

import { use, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap } from "lucide-react";

import { getAllScholarships } from "@/services/scholarship.services";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { IScholarship } from "@/types/scholarship";
import { PaginationMeta } from "@/types/api.types";
import DataTable from "@/components/shared/table/DataTable";

import { scholarshipColumns } from "./scholarshipColumns";
import CreateScholarshipModal from "./CreateScholarshipModal";
import EditScholarshipModal from "./EditScholarshipModal";
import ChangeStatusModal from "./ChangeStatusModal";
import DeleteScholarshipModal from "./DeleteScholarshipModal";
import ViewScholarshipDialog from "./ViewScholarshipModal";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default function ScholarshipsTable({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<Record<string, string | string[]>>;
}) {
  const resolvedSearchParams = use(searchParamsPromise);
  const initialQueryString = new URLSearchParams(
    resolvedSearchParams as Record<string, string>,
  ).toString();

  const searchParams = useSearchParams();

  // Standard view / edit / delete
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
  } = useRowActionModalState<IScholarship>();

  // Extra: Change Status modal
  const [statusItem, setStatusItem] = useState<IScholarship | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleOpenStatusModal = (scholarship: IScholarship) => {
    setStatusItem(scholarship);
    setIsStatusModalOpen(true);
    onViewOpenChange(false); // close view dialog if open
  };

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
    data: scholarshipsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["scholarships", queryString],
    queryFn: () => getAllScholarships(queryString),
  });

  const scholarships: IScholarship[] = scholarshipsResponse?.data ?? [];
  const meta: PaginationMeta | undefined = scholarshipsResponse?.meta;

  return (
    <>
      {/* Header */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <GraduationCap
              className="h-7 w-7 text-primary"
              style={{ color: "#0097b2" }}
            />
            Scholarships
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage scholarships for your university.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
        <DataTable
          data={scholarships}
          columns={scholarshipColumns}
          isLoading={isLoading || isFetching || isRouteRefreshPending}
          emptyMessage="No scholarships found."
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
            placeholder: "Search scholarships by title...",
            debounceMs: 700,
            onDebouncedChange: handleDebouncedSearchChange,
          }}
          toolbarAction={
            <CreateScholarshipModal onSuccess={() => refetch()} />
          }
          meta={meta}
          actions={tableActions}
        />
      </div>

      {/* Modals */}
      <ViewScholarshipDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        scholarship={viewingItem}
        onChangeStatus={handleOpenStatusModal}
        onEdit={(s) => {
          onViewOpenChange(false);
          // Slight delay so view dialog closes first
          setTimeout(() => {
            tableActions.onEdit?.(s);
          }, 150);
        }}
      />

      <EditScholarshipModal
        open={isEditModalOpen}
        onOpenChange={onEditOpenChange}
        scholarship={editingItem}
        onSuccess={() => refetch()}
      />

      <ChangeStatusModal
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        scholarship={statusItem}
        onSuccess={() => refetch()}
      />

      <DeleteScholarshipModal
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        scholarship={deletingItem}
        onSuccess={() => refetch()}
      />
    </>
  );
}