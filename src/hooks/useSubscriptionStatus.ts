/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export type SubscriptionStatus = 
  | "INACTIVE"
  | "ACTIVE"
  | "EXPIRED"
  | "CANCELLED"
  | null;

export function useSubscriptionStatus() {
  const [status, setStatus] = useState<SubscriptionStatus>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if middleware set subscription alert in URL
    const alert = searchParams.get("alert");
    if (alert === "subscription-required") {
      setStatus("INACTIVE");
    } else if (alert === "subscription-expired") {
      setStatus("EXPIRED");
    }
    
    // You can also fetch status directly from API if needed
    // fetchSubscriptionStatus().then(setStatus);
  }, [pathname, searchParams]);

  return {
    status,
    isActive: status === "ACTIVE",
    isInactive: status === "INACTIVE",
    isExpired: status === "EXPIRED" || status === "CANCELLED",
    canWrite: status === "ACTIVE",
    canRead: status === "ACTIVE" || status === "EXPIRED" || status === "CANCELLED",
  };
}