// src/app/(dashboardLayout)/(superAdminRoutes)/super-admin/users-management/_components/UsersTable.tsx

"use client";

import { use, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";

import { getAllUsers } from "@/services/user.services";
import { useRowActionModalState } from "@/hooks/useRowActionModalState";
import { useServerManagedDataTableSearch } from "@/hooks/useServerManagedDataTableSearch";
import { useServerManagedDataTable } from "@/hooks/useServerManagedDataTable";
import type { IUser } from "@/types/user";
import type { PaginationMeta } from "@/types/api.types";
import DataTable from "@/components/shared/table/DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { userColumns } from "./userColumns";
import ViewUserDialog from "./ViewUserDialog";
import ChangeUserStatusModal from "./ChangeUserStatusModal";
import DeleteUserModal from "./DeleteUserModal";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 15;
const BRAND_TEAL = "#0097b2";

export default function UsersTable({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<Record<string, string | string[]>>;
}) {
  const resolvedSearchParams = use(searchParamsPromise);
  const initialQueryString = new URLSearchParams(
    resolvedSearchParams as Record<string, string>
  ).toString();

  const searchParams = useSearchParams();

  // Row action modals
  const {
    viewingItem,
    deletingItem,
    isViewDialogOpen,
    isDeleteDialogOpen,
    onViewOpenChange,
    onDeleteOpenChange,
    tableActions,
  } = useRowActionModalState<IUser>();

  // Change Status modal
  const [statusItem, setStatusItem] = useState<IUser | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleOpenStatusModal = (user: IUser) => {
    setStatusItem(user);
    setIsStatusModalOpen(true);
    onViewOpenChange(false);
  };

  // Filters
  const [roleFilter, setRoleFilter] = useState("all");
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

  // Build query string with filters
  const baseQuery = queryStringFromUrl || initialQueryString;
  const queryString = useMemo(() => {
    const params = new URLSearchParams(baseQuery);
    if (roleFilter !== "all") params.set("role", roleFilter);
    else params.delete("role");
    if (statusFilter !== "all") params.set("status", statusFilter);
    else params.delete("status");
    return params.toString();
  }, [baseQuery, roleFilter, statusFilter]);

  const { searchTermFromUrl, handleDebouncedSearchChange } =
    useServerManagedDataTableSearch({
      searchParams,
      updateParams,
    });

  const {
    data: usersResponse,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["users-management", queryString],
    queryFn: () => getAllUsers(queryString),
  });

  const users: IUser[] = usersResponse?.data ?? [];
  const meta: PaginationMeta | undefined = usersResponse?.meta;

  return (
    <>
      {/* Header */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Users
              className="h-7 w-7 text-primary"
              style={{ color: BRAND_TEAL }}
            />
            Users Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage all platform users across every role.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
        <DataTable
          data={users}
          columns={userColumns}
          isLoading={isLoading || isFetching || isRouteRefreshPending}
          emptyMessage="No users found."
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
            placeholder: "Search by name or email...",
            debounceMs: 700,
            onDebouncedChange: handleDebouncedSearchChange,
          }}
          toolbarAction={
            <div className="flex items-center gap-2">
              <Select
                value={roleFilter}
                onValueChange={setRoleFilter}
              >
                <SelectTrigger className="h-9 w-40 rounded-xl text-xs font-semibold">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="UNIVERSITY_ADMIN">
                    University Admin
                  </SelectItem>
                  <SelectItem value="DEPARTMENT_HEAD">
                    Department Head
                  </SelectItem>
                  <SelectItem value="COMMITTEE_REVIEWER">
                    Committee Reviewer
                  </SelectItem>
                  <SelectItem value="STUDENT">Student</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="h-9 w-36 rounded-xl text-xs font-semibold">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="BANNED">Banned</SelectItem>
                  <SelectItem value="DELETED">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
          meta={meta}
          actions={tableActions}
        />
      </div>

      {/* View Dialog */}
      <ViewUserDialog
        open={isViewDialogOpen}
        onOpenChange={onViewOpenChange}
        user={viewingItem}
        onChangeStatus={handleOpenStatusModal}
        onDelete={(u) => {
          onViewOpenChange(false);
          setTimeout(() => {
            tableActions.onDelete?.(u);
          }, 150);
        }}
      />

      {/* Change Status Modal */}
      <ChangeUserStatusModal
        open={isStatusModalOpen}
        onOpenChange={setIsStatusModalOpen}
        user={statusItem}
        onSuccess={() => refetch()}
      />

      {/* Delete Modal */}
      <DeleteUserModal
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteOpenChange}
        user={deletingItem}
        onSuccess={() => refetch()}
      />
    </>
  );
}