// src/app/(dashboardLayout)/(superAdminRoutes)/super-admin/universities-management/[id]/_components/UniversityDetail.tsx

"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Building2,
  Users,
  GraduationCap,
  Globe,
  Shield,
  Layers,
  UserCog,
  Calendar,
  Mail,
  Crown,
  CreditCard,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IUniversityDetailResponse } from "@/types/university";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {  getUniversityDetailById } from "@/services/university.services";
import type { IUniversity } from "@/types/university";
import { UNIVERSITY_STATUS_LABELS, UNIVERSITY_STATUS_COLORS } from "@/types/university";
import ChangeStatusModal from "./ChangeStatusModal";
import DeleteUniversityModal from "./DeleteUniversityModal";

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

interface Props {
  universityId: string;
}

export default function UniversityDetail({ universityId }: Props) {
  const queryClient = useQueryClient();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data, isLoading } = useQuery<IUniversityDetailResponse>({
    queryKey: ["university-detail", universityId],
    queryFn: () => getUniversityDetailById(universityId),
  });

  const uni = data?.data;

  const refetchDetail = () => {
    queryClient.invalidateQueries({
      queryKey: ["university-detail", universityId],
    });
    queryClient.invalidateQueries({
      queryKey: ["universities-management"],
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!uni) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" asChild className="font-bold">
          <Link href="/super-admin/universities-management">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Link>
        </Button>
        <Card className="rounded-2xl">
          <CardContent className="pt-12 pb-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-bold">University not found</h3>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusColor = UNIVERSITY_STATUS_COLORS[uni.status] ?? "#6b7280";

  // Build a minimal IUniversity for the modals
  const uniForModal: IUniversity = {
    id: uni.id,
    name: uni.name,
    logoUrl: uni.logoUrl,
    logoPublicId: uni.logoPublicId,
    website: uni.website,
    status: uni.status,
    stripeCustomerId: uni.stripeCustomerId,
    subscriptionId: uni.subscriptionId,
    isDeleted: uni.isDeleted, // ← add
    deletedAt: uni.deletedAt,
    createdAt: uni.createdAt,
    updatedAt: uni.updatedAt,
    _count: uni._count,
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button variant="ghost" asChild className="font-bold">
        <Link href="/super-admin/universities-management">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Universities
        </Link>
      </Button>

      {/* Header Card */}
      <Card className="overflow-hidden rounded-2xl">
        <div
          className="h-2"
          style={{
            background: `linear-gradient(90deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
          }}
        />
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/30 border border-border/40 overflow-hidden shrink-0">
                {uni.logoUrl ? (
                  <Image
                    src={uni.logoUrl}
                    alt={uni.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold">{uni.name}</h1>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <Badge
                    className="font-bold gap-1"
                    style={{
                      backgroundColor: `${statusColor}15`,
                      color: statusColor,
                      border: `1px solid ${statusColor}40`,
                    }}
                  >
                    {UNIVERSITY_STATUS_LABELS[uni.status]}
                  </Badge>
                  {uni.website && (
                    <a
                      href={uni.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:underline flex items-center gap-1"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      {uni.website.replace(/https?:\/\//, "")}
                    </a>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registered {format(new Date(uni.createdAt), "MMMM dd, yyyy")}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              <Button
                variant="outline"
                className="rounded-xl font-bold gap-2"
                onClick={() => setStatusModalOpen(true)}
              >
                <RefreshCw className="h-4 w-4" />
                Change Status
              </Button>
              <Button
                variant="destructive"
                className="rounded-xl font-bold gap-2"
                onClick={() => setDeleteModalOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: UserCog,
            label: "Admins",
            value: uni._count?.admins ?? 0,
            color: BRAND_PURPLE,
          },
          {
            icon: GraduationCap,
            label: "Students",
            value: uni._count?.students ?? 0,
            color: BRAND_TEAL,
          },
          {
            icon: Layers,
            label: "Departments",
            value: uni._count?.departments ?? 0,
            color: "#f59e0b",
          },
          {
            icon: Shield,
            label: "Scholarships",
            value: uni._count?.scholarships ?? 0,
            color: "#8b5cf6",
          },
          {
            icon: Users,
            label: "Dept Heads",
            value: uni._count?.departmentHeads ?? 0,
            color: "#0ea5e9",
          },
          {
            icon: Users,
            label: "Reviewers",
            value: uni._count?.reviewers ?? 0,
            color: "#16a34a",
          },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="rounded-xl">
            <CardContent className="pt-5 pb-5 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold">{value}</p>
                <p className="text-xs text-muted-foreground font-semibold">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Admins */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <UserCog className="h-5 w-5 text-muted-foreground" />
              Administrators ({uni.admins?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!uni.admins || uni.admins.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No administrators.
              </p>
            ) : (
              uni.admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between rounded-xl border border-border/40 p-3 hover:bg-muted/10 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/50 text-sm font-bold shrink-0 overflow-hidden">
                      {admin.user?.image ? (
                        <Image
                          src={admin.user.image}
                          alt={admin.user.name}
                          width={36}
                          height={36}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        (admin.user?.name?.charAt(0)?.toUpperCase() ?? "A")
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">
                        {admin.user?.name ?? admin.name}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3 shrink-0" />
                        {admin.user?.email ?? admin.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {admin.isOwner && (
                      <Badge
                        className="text-xs font-bold gap-1"
                        style={{
                          backgroundColor: `${BRAND_PURPLE}15`,
                          color: BRAND_PURPLE,
                          border: `1px solid ${BRAND_PURPLE}40`,
                        }}
                      >
                        <Crown className="h-3 w-3" />
                        Owner
                      </Badge>
                    )}
                    <Badge
                      variant={
                        admin.subscriptionStatus === "ACTIVE" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {admin.subscriptionStatus}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Departments */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Layers className="h-5 w-5 text-muted-foreground" />
              Departments ({uni.departments?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!uni.departments || uni.departments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No departments created.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {uni.departments.map((dept) => (
                  <Badge
                    key={dept.id}
                    variant="outline"
                    className="text-sm font-semibold px-3 py-1.5 rounded-xl"
                  >
                    {dept.name}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Meta Info */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            System Info
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCard
              icon={Calendar}
              label="Registered"
              value={format(new Date(uni.createdAt), "MMMM dd, yyyy · h:mm a")}
            />
            <InfoCard
              icon={Calendar}
              label="Last Updated"
              value={format(new Date(uni.updatedAt), "MMMM dd, yyyy · h:mm a")}
            />
            {uni.stripeCustomerId && (
              <InfoCard
                icon={CreditCard}
                label="Stripe Customer ID"
                value={uni.stripeCustomerId}
                mono
              />
            )}
            {uni.subscriptionId && (
              <InfoCard
                icon={CreditCard}
                label="Subscription ID"
                value={uni.subscriptionId}
                mono
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ChangeStatusModal
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        university={uniForModal}
        onSuccess={refetchDetail}
      />
      <DeleteUniversityModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        university={uniForModal}
        onSuccess={() => {
          refetchDetail();
          // Could also redirect: router.push("/super-admin/universities-management")
        }}
      />
    </div>
  );
}

// ─── Micro-component ───

function InfoCard({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl bg-muted/10 border border-border/40 p-3">
      <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className={`font-bold mt-0.5 text-sm ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </p>
    </div>
  );
}
