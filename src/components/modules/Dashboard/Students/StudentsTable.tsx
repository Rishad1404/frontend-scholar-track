// src/components/modules/Dashboard/Students/StudentsTable.tsx

"use client";

import { use } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Users, Filter } from "lucide-react";

import { getAllStudents } from "@/services/student.services";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { IStudent, ACADEMIC_STATUS_LABELS } from "@/types/student"; // Ensure this is imported
import { PaginationMeta } from "@/types/api.types";
import DataTable from "@/components/shared/table/DataTable";

import { studentColumns } from "./studentsColumns";
import ViewStudentDialog from "./ViewStudentDialog";
import ChangeStatusModal from "./ChangeStatusModal";
import DeleteStudentModal from "./DeleteStudentModal";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const router = useRouter();
  const pathname = usePathname();

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

  const currentStatusFilter = searchParams.get("academicInfo.academicStatus") || "all";

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set("academicInfo.academicStatus", value);
    } else {
      params.delete("academicInfo.academicStatus");
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
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
    data: studentsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["students", queryString],
    queryFn: () => getAllStudents(queryString),
  });

  const students: IStudent[] = studentsResponse?.data ?? [];
  const meta: PaginationMeta | undefined = studentsResponse?.meta;

  return (
    <>
      {/* ─── Page Header ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-foreground">
            <Users className="h-8 w-8 text-primary" style={{ color: "#0097b2" }} />
            Students Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">
            View, filter, and manage all student accounts in your university.
          </p>
        </div>
      </div>

      {/* ─── Premium Filter & Table Card ─── */}
      <div className="rounded-[2rem] border border-border/40 bg-card shadow-xl shadow-foreground/5 overflow-hidden">
        {/* Filter Toolbar (No Cancel Button) */}
        <div className="border-b border-border/40 bg-muted/10 px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Filter className="h-4 w-4 text-primary" style={{ color: "#0097b2" }} />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-foreground">
              Filter Records
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Select value={currentStatusFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-50 h-10 rounded-xl border-border/60 bg-background shadow-sm font-semibold transition-colors focus:ring-primary/50">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all" className="font-bold text-foreground">
                  All Statuses
                </SelectItem>
                {/* Dynamically maps over your existing status labels */}
                {Object.entries(ACADEMIC_STATUS_LABELS || {}).map(([key, label]) => (
                  <SelectItem
                    key={key}
                    value={key}
                    className="font-semibold text-muted-foreground"
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Data Table */}
        <div className="p-4 sm:p-6 pt-2">
          <DataTable
            data={students}
            columns={studentColumns}
            isLoading={isLoading || isFetching || isRouteRefreshPending}
            emptyMessage="No students found matching your criteria."
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
      </div>

      {/* Modals */}
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
