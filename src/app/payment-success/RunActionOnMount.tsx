"use client";

import { useEffect, useRef } from "react";
// ✅ Your correct import path!
import { handleStripeReturn } from "../(dashboardLayout)/(adminRoutes)/admin/subscription/_actions";

export function RunActionOnMount({ sessionId, isSuccess }: { sessionId?: string, isSuccess: boolean }) {
  const hasRun = useRef(false);

  useEffect(() => {
    // This ensures the action only runs ONCE when the user lands on the page
    if (!hasRun.current && sessionId) {
      hasRun.current = true;
      handleStripeReturn(sessionId, isSuccess).catch(console.error);
    }
  }, [sessionId, isSuccess]);

  return null; // This is invisible, it just runs the background task!
}