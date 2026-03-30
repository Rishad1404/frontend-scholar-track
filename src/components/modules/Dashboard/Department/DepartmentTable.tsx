// src/components/modules/Dashboard/Department/DepartmentTable.tsx

"use client";

import { use } from "react";
import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { getAllDepartments } from "@/services/department.services";
import { IDepartment } from "@/types/department";
import { PaginationMeta } from "@/types/api.types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Building2 } from "lucide-react";
import { departmentColumns } from "./departmentColumns";
import CreateDepartmentModal from "./CreateDepartmentModal";
import EditDepartmentModal from "./EditDepartmentModal";
import DeleteDepartmentModal from "./DeleteDepartmentModal";
import ViewDepartmentDialog from "./ViewDepartmentDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default function DepartmentTable({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<Record<string, string | string[]>>;
}) {
  const resolvedSearchParams = use(searchParamsPromise);
  const initialQueryString = new URLSearchParams(
    resolvedSearchParams as Record<string, string>
  ).toString();

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
  } = useRowActionModalState<IDepartment>();

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

  const { data: departmentResponse, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["departments", queryString],
    queryFn: () => getAllDepartments(queryString),
  });

  const departments: IDepartment[] = departmentResponse?.data ?? [];
  const meta: PaginationMeta | undefined = departmentResponse?.meta;

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-7 w-7 text-primary" style={{ color: "#0097b2" }} />
            Departments
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create and manage the departments in your university.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
        <DataTable
          data={departments}
          columns={departmentColumns}
          isLoading={isLoading || isFetching || isRouteRefreshPending}
          emptyMessage="No departments found."
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
            placeholder: "Search departments by name...",
            debounceMs: 700,
            onDebouncedChange: handleDebouncedSearchChange,
          }}
          toolbarAction={
            <CreateDepartmentModal onSuccess={() => refetch()} />
          }
          meta={meta}
          actions={tableActions}
        />
      </div>

      <ViewDepartmentDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        department={viewingItem}
      />

      <EditDepartmentModal
        open={isEditModalOpen}
        onOpenChange={onEditOpenChange}
        department={editingItem}
        onSuccess={() => refetch()}
      />

      <DeleteDepartmentModal
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        department={deletingItem}
        onSuccess={() => refetch()}
      />
    </>
  );
}