// src/components/modules/Dashboard/University/UniversityInfoCard.tsx

"use client";

import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Globe, Calendar, ShieldCheck, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import type { IUniversity, UniversityStatus } from "@/types/university";
import Image from "next/image";

const statusConfig: Record<UniversityStatus, { color: string; bg: string; icon: React.ElementType }> = {
  APPROVED: { color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 },
  PENDING: { color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20", icon: Clock },
  SUSPENDED: { color: "text-rose-500", bg: "bg-rose-500/10 border-rose-500/20", icon: AlertTriangle },
};

const BRAND_TEAL = "#0097b2";
const BRAND_PURPLE = "#4b2875";

interface Props {
  university: IUniversity;
}

export default function UniversityInfoCard({ university }: Props) {
  const StatusIcon = statusConfig[university.status].icon;

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-card shadow-lg transition-all hover:shadow-xl">
      {/* ─── Grand Cover Banner with Premium Overlay ─── */}
      <div className="relative h-48 w-full sm:h-64">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Subtle inner shadow/glow for depth */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
      </div>

      <div className="px-6 pb-12 sm:px-12">
        {/* ─── Massive Centered Logo with Glow ─── */}
        <div className="relative -mt-24 mb-8 flex justify-center sm:-mt-32">
          <div className="relative flex h-40 w-40 items-center justify-center rounded-[2rem] border-8 border-background bg-card shadow-2xl sm:h-48 sm:w-48">
            {/* Subtle background glow matching the brand */}
            <div 
              className="absolute -inset-1 -z-10 rounded-[2rem] blur-xl opacity-20"
              style={{ background: `linear-gradient(135deg, ${BRAND_PURPLE}, ${BRAND_TEAL})` }}
            />
            
            {university.logoUrl ? (
              <div className="relative h-full w-full p-4">
                <Image
                  src={university.logoUrl}
                  alt={university.name}
                  fill
                  sizes="(max-width: 768px) 160px, 192px"
                  className="object-contain p-2"
                  priority
                />
              </div>
            ) : (
              <span className="text-5xl font-extrabold text-muted-foreground uppercase sm:text-6xl bg-clip-text text-transparent bg-gradient-to-br from-muted-foreground to-muted-foreground/50">
                {university.name.substring(0, 2)}
              </span>
            )}
          </div>
        </div>

        {/* ─── Centered Details ─── */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            {university.name}
          </h1>

          <div className="mt-5 flex items-center justify-center">
            <Badge
              variant="outline"
              className={`px-4 py-1.5 text-sm font-bold uppercase tracking-widest backdrop-blur-md shadow-sm ${statusConfig[university.status].bg} ${statusConfig[university.status].color}`}
            >
              <StatusIcon className="mr-2 h-4 w-4" />
              {university.status}
            </Badge>
          </div>

          {/* ─── Premium Pill-Style Meta Details ─── */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
            {university.website && (
              <a
                href={university.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 rounded-full border border-border/50 bg-muted/20 px-5 py-2.5 text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground hover:shadow-sm"
              >
                <Globe className="h-4 w-4 transition-colors group-hover:text-primary" style={{ color: BRAND_TEAL }} />
                {university.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            )}

            <div className="flex items-center gap-2.5 rounded-full border border-border/50 bg-muted/20 px-5 py-2.5 text-muted-foreground">
              <ShieldCheck className="h-4 w-4" style={{ color: BRAND_PURPLE }} />
              <span>Joined {format(new Date(university.createdAt), "MMMM yyyy")}</span>
            </div>

            <div className="flex items-center gap-2.5 rounded-full border border-border/50 bg-muted/20 px-5 py-2.5 text-muted-foreground">
              <Calendar className="h-4 w-4 opacity-60" />
              <span>Updated {format(new Date(university.updatedAt), "MMM dd, yyyy")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}