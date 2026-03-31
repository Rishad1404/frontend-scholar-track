"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { UserCog } from "lucide-react";

import DataTable from "@/components/shared/table/DataTable";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import {
  serverManagedFilter,
  useServerManagedDataTableFilters,
} from "@/hooks/useServerManagedDataTableFilters";
import { getAllDepartmentHeads } from "@/services/departmentHead.services";
import { getAllDepartments } from "@/services/department.services";
import type { IDepartmentHead } from "@/types/departmentHead";
import type { PaginationMeta } from "@/types/api.types";
import type {
  DataTableFilterConfig,
  DataTableFilterValues,
} from "@/components/shared/table/DataTableFilters";

import { departmentHeadColumns } from "./departmentHeadColumns";

import { useMemo } from "react";
import { CreateInviteDialog } from "../../Admin/InviteManagement";
import ViewDepartmentHeadDialog from "./ViewDepartmentHeadDialog";
import EditDepartmentHeadModal from "./EditDepartmentHeadModal";
import DeleteDepartmentHeadDialog from "./DeleteDepartmentHeadDialog";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const DEPT_HEAD_FILTER_DEFINITIONS = [
  serverManagedFilter.single("departmentId"),
];

export default function DepartmentHeadTable() {
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
  } = useRowActionModalState<IDepartmentHead>();

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

  const { filterValues, handleFilterChange, clearAllFilters } =
    useServerManagedDataTableFilters({
      searchParams,
      definitions: DEPT_HEAD_FILTER_DEFINITIONS,
      updateParams,
    });

  // Fetch department heads
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["department-heads", queryStringFromUrl],
    queryFn: () => getAllDepartmentHeads(queryStringFromUrl),
  });

  // Fetch departments for filter + invite dialog
  const { data: departmentData } = useQuery({
    queryKey: ["departments-for-dept-heads"],
    queryFn: () => getAllDepartments(),
    staleTime: 1000 * 60 * 10,
  });

  const deptHeads: IDepartmentHead[] = data?.data ?? [];
  const meta: PaginationMeta | undefined = data?.meta;

  const departments = (departmentData?.data ?? []).map((dept) => ({
    id: dept.id,
    name: dept.name,
    universityId: dept.universityId,
  }));

  // Filter configs
  const filterConfigs = useMemo<DataTableFilterConfig[]>(
    () => [
      {
        id: "departmentId",
        label: "Department",
        type: "single-select" as const,
        options: departments.map((dept) => ({
          label: dept.name,
          value: dept.id,
        })),
      },
    ],
    [departments]
  );

  const filterValuesForTable = useMemo<DataTableFilterValues>(
    () => ({
      departmentId: filterValues.departmentId,
    }),
    [filterValues]
  );

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <UserCog className="h-7 w-7 text-primary" />
            Department Heads
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Invite and manage department heads for your university.
          </p>
        </div>
      </div>

      <DataTable
        data={deptHeads}
        columns={departmentHeadColumns}
        isLoading={isLoading || isFetching || isRouteRefreshPending}
        emptyMessage="No department heads found."
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
          placeholder: "Search by name, email, phone...",
          debounceMs: 700,
          onDebouncedChange: handleDebouncedSearchChange,
        }}
        filters={{
          configs: filterConfigs,
          values: filterValuesForTable,
          onFilterChange: handleFilterChange,
          onClearAll: clearAllFilters,
        }}
        toolbarAction={<CreateInviteDialog departments={departments} />}
        meta={meta}
        actions={tableActions}
      />

      <ViewDepartmentHeadDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        departmentHead={viewingItem}
      />

      <EditDepartmentHeadModal
        open={isEditModalOpen}
        onOpenChange={onEditOpenChange}
        departmentHead={editingItem}
        onSuccess={() => refetch()}
      />

      <DeleteDepartmentHeadDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        departmentHead={deletingItem}
        onSuccess={() => refetch()}
      />
    </>
  );
}