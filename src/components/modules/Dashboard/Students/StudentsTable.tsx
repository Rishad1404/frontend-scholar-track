"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";

import { getAllStudents } from "@/services/student.services";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { IStudent } from "@/types/student";
import { PaginationMeta } from "@/types/api.types";
import DataTable from "@/components/shared/table/DataTable";
import { studentColumns } from "./studentsColumns";
import ViewStudentDialog from "./ViewStudentDialog";
import ChangeStatusModal from "./ChangeStatusModal";
import DeleteStudentModal from "./DeleteStudentModal";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default function StudentsTable({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<Record<string, string | string[]>>;
}) {
  const resolvedSearchParams = use(searchParamsPromise);
  const initialQueryString = new URLSearchParams(
    resolvedSearchParams as Record<string, string>,
  ).toString();

  const searchParams = useSearchParams();

  const {
    viewingItem,
    editingItem: changingStatusItem,
    deletingItem,
    isViewDialogOpen,
    isEditModalOpen: isStatusModalOpen,
    isDeleteDialogOpen,
    onViewOpenChange,
    onEditOpenChange: onStatusOpenChange,
    onDeleteOpenChange,
    tableActions,
  } = useRowActionModalState<IStudent>();

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

  const { data: studentsResponse, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["students", queryString],
    queryFn: () => getAllStudents(queryString),
  });

  const students: IStudent[] = studentsResponse?.data ?? [];
  const meta: PaginationMeta | undefined = studentsResponse?.meta;

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" style={{ color: "#0097b2" }} />
            Students
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            View and manage all students in your university.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
        <DataTable
          data={students}
          columns={studentColumns}
          isLoading={isLoading || isFetching || isRouteRefreshPending}
          emptyMessage="No students found."
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
            placeholder: "Search students by name, email, or student ID...",
            debounceMs: 700,
            onDebouncedChange: handleDebouncedSearchChange,
          }}
          meta={meta}
          actions={tableActions}
        />
      </div>

      <ViewStudentDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        student={viewingItem}
      />

      <ChangeStatusModal
        open={isStatusModalOpen}
        onOpenChange={onStatusOpenChange}
        student={changingStatusItem}
        onSuccess={() => refetch()}
      />

      <DeleteStudentModal
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        student={deletingItem}
        onSuccess={() => refetch()}
      />
    </>
  );
}