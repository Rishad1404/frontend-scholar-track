export type DisbursementStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface IDisbursement {
  id: string;
  applicationId: string;
  studentId: string;
  amount: number;
  currency: string;
  status: DisbursementStatus;
  platformFee: number;
  createdAt: string;
  student: {
    id: string;
    user: { id: string; name: string; email: string };
  };
  scholarship: {
    id: string;
    title: string;
    amountPerStudent: number;
  };
  university: { id: string; name: string };
}

export const DISBURSEMENT_STATUS_LABELS: Record<DisbursementStatus, string> = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  FAILED: "Failed",
};