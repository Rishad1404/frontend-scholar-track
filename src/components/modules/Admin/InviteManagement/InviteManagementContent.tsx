/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatEnumLabel } from "@/lib/formatters";
import { cancelInvite, getInvites } from "@/services/invite.services";
import { IDepartment, IInvite } from "@/types/invites.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MailPlus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import CreateInviteDialog from "./CreateInviteDialog";
import InviteStatusBadge from "./InviteStatusBadge";

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════

type DerivedStatus = "PENDING" | "ACCEPTED" | "EXPIRED";

function deriveStatus(invite: IInvite): DerivedStatus {
  if (invite.used) return "ACCEPTED";
  if (new Date(invite.expiresAt) < new Date()) return "EXPIRED";
  return "PENDING";
}

function extractInvites(response: any): IInvite[] {
  if (!response) return [];
  const candidates = [response?.data?.data, response?.data, response];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}

function getDepartmentName(
  invite: IInvite,
  departments: IDepartment[]
): string {
  // 1. Backend included department relation
  if (invite.department?.name) return invite.department.name;

  // 2. Resolve from departments prop using departmentId
  if (invite.departmentId) {
    const found = departments.find((d) => d.id === invite.departmentId);
    if (found) return found.name;
  }

  return "—";
}

// ═══════════════════════════════════════════
// PROPS
// ═══════════════════════════════════════════
interface InviteManagementContentProps {
  universityId?: string;
  departments: IDepartment[];
}

// ═══════════════════════════════════════════
// LOADING SKELETON
// ═══════════════════════════════════════════
const InvitesSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-7 w-52" />
        <Skeleton className="mt-1.5 h-4 w-80" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
    <Skeleton className="h-10 w-45" />
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

// ═══════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════
const EmptyState = ({ isFiltered }: { isFiltered: boolean }) => (
  <div className="flex h-75 flex-col items-center justify-center text-center">
    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
      <MailPlus className="h-7 w-7 text-muted-foreground" />
    </div>
    <p className="text-sm font-medium text-foreground">
      {isFiltered ? "No invites match this filter" : "No invites yet"}
    </p>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
      {isFiltered
        ? "Try changing the filter to see other invites."
        : "Start by inviting Department Heads or Committee Reviewers to join your university."}
    </p>
  </div>
);

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════
const InviteManagementContent = ({
  departments,
}: InviteManagementContentProps) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<DerivedStatus | "ALL">(
    "ALL"
  );
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // ── Fetch ALL invites ──
  const {
    data: invitesResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["invites"],
    queryFn: () => getInvites(),
    refetchOnWindowFocus: "always",
  });

  const allInvites = extractInvites(invitesResponse);

  // ── Client-side filtering ──
  const filteredInvites = useMemo(() => {
    if (statusFilter === "ALL") return allInvites;
    return allInvites.filter(
      (invite) => deriveStatus(invite) === statusFilter
    );
  }, [allInvites, statusFilter]);

  // ── Client-side pagination ──
  const limit = 10;
  const totalPages = Math.max(1, Math.ceil(filteredInvites.length / limit));
  const paginatedInvites = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredInvites.slice(start, start + limit);
  }, [filteredInvites, page]);

  // ── Status counts ──
  const statusCounts = useMemo(() => {
    const counts = {
      ALL: allInvites.length,
      PENDING: 0,
      ACCEPTED: 0,
      EXPIRED: 0,
    };
    allInvites.forEach((invite) => {
      counts[deriveStatus(invite)]++;
    });
    return counts;
  }, [allInvites]);

  const handleFilterChange = (val: string) => {
    setStatusFilter(val as DerivedStatus | "ALL");
    setPage(1);
  };

  // ── Cancel invite mutation ──
  const { mutate: handleCancel } = useMutation({
    mutationFn: cancelInvite,
    onMutate: (inviteId: string) => {
      setCancellingId(inviteId);
      // 🚨 Start the loading toast and pass the ID to context
      const toastId = toast.loading("Cancelling invitation...");
      return { toastId };
    },
    onSuccess: (response: any, variables, context) => {
      // 🚨 Update the toast to success
      toast.success(
        response?.message ||
          response?.data?.message ||
          "Invite cancelled successfully!",
        { id: context?.toastId }
      );
      queryClient.invalidateQueries({ queryKey: ["invites"] });
    },
    onError: (error: any, variables, context) => {
      // 🚨 Update the toast to error
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to cancel invite",
        { id: context?.toastId }
      );
    },
    onSettled: () => {
      setCancellingId(null);
    },
  });

  if (isLoading) return <InvitesSkeleton />;

  if (isError) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Failed to load invites
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Something went wrong while fetching invitation data.
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Invite Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Invite Department Heads and Committee Reviewers to your university.
          </p>
        </div>
        <CreateInviteDialog departments={departments} />
      </div>

      {/* ═══ FILTER ═══ */}
      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-50">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">
              All Invites ({statusCounts.ALL})
            </SelectItem>
            <SelectItem value="PENDING">
              Pending ({statusCounts.PENDING})
            </SelectItem>
            <SelectItem value="ACCEPTED">
              Accepted ({statusCounts.ACCEPTED})
            </SelectItem>
            <SelectItem value="EXPIRED">
              Expired ({statusCounts.EXPIRED})
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Showing {filteredInvites.length} of {allInvites.length} invites
        </p>
      </div>

      {/* ═══ TABLE ═══ */}
      <Card className="border-border/40 bg-card/60 shadow-sm backdrop-blur-xl">
        <CardContent className="p-0">
          {paginatedInvites.length === 0 ? (
            <EmptyState isFiltered={statusFilter !== "ALL"} />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Department
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Sent
                    </TableHead>
                    <TableHead className="hidden lg:table-cell">
                      Expires
                    </TableHead>
                    <TableHead className="w-12.5" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedInvites.map((invite) => {
                    const status = deriveStatus(invite);
                    const isPending = status === "PENDING";
                    const isThisCancelling = cancellingId === invite.id;

                    return (
                      <TableRow key={invite.id}>
                        <TableCell>
                          <p className="text-sm font-medium text-foreground">
                            {invite.email}
                          </p>
                        </TableCell>
                        <TableCell>
                          <span className="rounded-md bg-[#4b2875]/10 px-2 py-0.5 text-xs font-semibold text-[#4b2875] dark:bg-[#4b2875]/20 dark:text-purple-300">
                            {formatEnumLabel(invite.role)}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {getDepartmentName(invite, departments)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <InviteStatusBadge
                            used={invite.used}
                            expiresAt={invite.expiresAt}
                          />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-xs text-muted-foreground">
                            {format(
                              parseISO(invite.createdAt),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-xs text-muted-foreground">
                            {format(
                              parseISO(invite.expiresAt),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          {isPending && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  disabled={isThisCancelling}
                                >
                                  {isThisCancelling ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Cancel Invitation?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently cancel the invitation
                                    sent to{" "}
                                    <span className="font-semibold text-foreground">
                                      {invite.email}
                                    </span>
                                    . They will no longer be able to use this
                                    invite link.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel
                                    disabled={isThisCancelling}
                                  >
                                    Keep Invite
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleCancel(invite.id)}
                                    disabled={isThisCancelling}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    {isThisCancelling ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Cancelling...
                                      </>
                                    ) : (
                                      "Cancel Invite"
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border/40 px-4 py-3">
                  <p className="text-xs text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteManagementContent;