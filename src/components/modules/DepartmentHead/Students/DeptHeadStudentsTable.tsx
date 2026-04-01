"use client";

import { use } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Users, Filter } from "lucide-react";

import { getAllStudents } from "@/services/student.services";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import { IStudent } from "@/types/student";
import { PaginationMeta } from "@/types/api.types";
import DataTable from "@/components/shared/table/DataTable";

import StudentDetailDialog from "./StudentDetailDialog";
import AcademicStatusDialog from "./AcademicStatusDialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { studentColumns } from "./studentsColumns";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default function DeptHeadStudentsTable({
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
    editingItem: statusStudent,
    isViewDialogOpen,
    isEditModalOpen: isStatusDialogOpen,
    onViewOpenChange,
    onEditOpenChange: onStatusOpenChange,
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
    queryKey: ["dept-head-students", queryString],
    queryFn: () => getAllStudents(queryString),
  });

  const students: IStudent[] = studentsResponse?.data ?? [];
  const meta: PaginationMeta | undefined = studentsResponse?.meta;

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-foreground">
            <div className="p-2 rounded-xl bg-primary/10">
              <Users className="h-7 w-7 text-primary" style={{ color: "#4b2875" }} />
            </div>
            Department Students
          </h1>
          <p className="text-muted-foreground text-sm font-medium ml-1">
            Monitor and manage academic standings for students in your department.
          </p>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-xl shadow-2xl shadow-foreground/5 overflow-hidden">
        <div className="border-b border-border/40 bg-muted/20 px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background border border-border/50 shadow-sm">
              <Filter className="h-4.5 w-4.5 text-muted-foreground" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Filter by Status
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Select value={currentStatusFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-56 h-11 rounded-2xl border-border/60 bg-background shadow-sm font-bold transition-all hover:border-primary/50 focus:ring-primary/20">
                <SelectValue placeholder="All Academic Statuses" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border/40 shadow-2xl">
                <SelectItem value="all" className="font-bold text-foreground">
                  All Students
                </SelectItem>
                <SelectItem value="REGULAR" className="font-semibold">
                  Regular
                </SelectItem>
                <SelectItem value="PROBATION" className="font-semibold">
                  Probation
                </SelectItem>
                <SelectItem value="SUSPENDED" className="font-semibold">
                  Suspended
                </SelectItem>
                <SelectItem
                  value="DROPPED_OUT"
                  className="font-semibold text-destructive"
                >
                  Dropped Out
                </SelectItem>
              </SelectContent>
            </Select>
            <Badge
              variant="secondary"
              className="h-11 px-5 rounded-2xl font-black text-xs uppercase bg-primary/5 text-primary border-primary/10"
            >
              {meta?.total || 0} Total
            </Badge>
          </div>
        </div>

        <div className="p-4 sm:p-8 pt-4">
          <DataTable
            data={students}
            columns={studentColumns}
            isLoading={isLoading || isFetching || isRouteRefreshPending}
            emptyMessage="No students found in your department."
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
              placeholder: "Search students...",
              debounceMs: 700,
              onDebouncedChange: handleDebouncedSearchChange,
            }}
            meta={meta}
            actions={tableActions}
          />
        </div>
      </div>

      <StudentDetailDialog
        open={isViewDialogOpen}
        onClose={() => onViewOpenChange(false)}
        student={viewingItem}
      />
      <AcademicStatusDialog
        open={isStatusDialogOpen}
        onClose={() => onStatusOpenChange(false)}
        student={statusStudent}
        onSuccess={() => {
          onStatusOpenChange(false);
          refetch();
        }}
      />
    </>
  );
}
