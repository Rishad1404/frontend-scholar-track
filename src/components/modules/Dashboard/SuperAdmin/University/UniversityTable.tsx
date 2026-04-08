// src/app/(dashboardLayout)/(superAdminRoutes)/super-admin/universities-management/_components/UniversitiesTable.tsx

"use client";

import { use, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Building2 } from "lucide-react";

import { getAllUniversities } from "@/services/university.services";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import type { IUniversity } from "@/types/university";
import type { PaginationMeta } from "@/types/api.types";
import DataTable from "@/components/shared/table/DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { universityColumns } from "./universityColumns";
import ViewUniversityDialog from "./ViewUniversityDialog";
import ChangeStatusModal from "./ChangeStatusModal";
import DeleteUniversityModal from "./DeleteUniversityModal";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const BRAND_TEAL = "#0097b2";

export default function UniversitiesTable({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<Record<string, string | string[]>>;
}) {
  const resolvedSearchParams = use(searchParamsPromise);
  const initialQueryString = new URLSearchParams(
    resolvedSearchParams as Record<string, string>
  ).toString();

  const searchParams = useSearchParams();

  // Row action modals (view / delete — no edit)
  const {
    viewingItem,
    deletingItem,
    isViewDialogOpen,
    isDeleteDialogOpen,
    onViewOpenChange,
    onDeleteOpenChange,
    tableActions,
  } = useRowActionModalState<IUniversity>();

  // Extra: Change Status modal
  const [statusItem, setStatusItem] = useState<IUniversity | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleOpenStatusModal = (university: IUniversity) => {
    setStatusItem(university);
    setIsStatusModalOpen(true);
    onViewOpenChange(false);
  };

  // Filter state
  const [statusFilter, setStatusFilter] = useState("all");

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

  // Build query string with status filter
  const baseQuery = queryStringFromUrl || initialQueryString;
  const queryString = useMemo(() => {
    const params = new URLSearchParams(baseQuery);
    if (statusFilter !== "all") params.set("status", statusFilter);
    else params.delete("status");
    return params.toString();
  }, [baseQuery, statusFilter]);

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  const {
    data: universitiesResponse,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["universities-management", queryString],
    queryFn: () => getAllUniversities(queryString),
  });

  const universities: IUniversity[] = universitiesResponse?.data ?? [];
  const meta: PaginationMeta | undefined = universitiesResponse?.meta;

  return (
    <>
      {/* Header */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Building2
              className="h-7 w-7 text-primary"
              style={{ color: BRAND_TEAL }}
            />
            Universities Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Approve, suspend, and manage all registered universities.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
        <DataTable
          data={universities}
          columns={universityColumns}
          isLoading={isLoading || isFetching || isRouteRefreshPending}
          emptyMessage="No universities found."
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
            placeholder: "Search universities by name...",
            debounceMs: 700,
            onDebouncedChange: handleDebouncedSearchChange,
          }}
          toolbarAction={
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="h-9 w-36 rounded-xl text-xs font-semibold">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          }
          meta={meta}
          actions={tableActions}
        />
      </div>

      {/* View Dialog */}
      <ViewUniversityDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        university={viewingItem}
        onChangeStatus={handleOpenStatusModal}
        onDelete={(u) => {
          onViewOpenChange(false);
          setTimeout(() => {
            tableActions.onDelete?.(u);
          }, 150);
        }}
      />


      {/* Change Status Modal */}
      <ChangeStatusModal
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        university={statusItem}
        onSuccess={() => refetch()}
      />

      {/* <EditUniversityModal
        open={isEditDialogOpen}
        onOpenChange={onEditOpenChange}
        university={editingItem}        
        onSuccess={() => refetch()}
      /> */}

      {/* Delete Modal */}
      <DeleteUniversityModal
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        university={deletingItem}
        onSuccess={() => refetch()}
      />
    </>
  );
}