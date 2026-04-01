import { z } from "zod";

// Placeholder if you need any admin-side validation in the future
export const applicationFilterSchema = z.object({
  status: z
    .enum([
      "DRAFT",
      "SUBMITTED",
      "SCREENING",
      "UNDER_REVIEW",
      "APPROVED",
      "REJECTED",
      "DISBURSED",
    ])
    .optional(),
});
export type TApplicationFilterPayload = z.infer<typeof applicationFilterSchema>;


export const makeDecisionSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED"], "Invalid decision value"),
  remarks: z
    .string()
    .max(5000, "Remarks must not exceed 5000 characters")
    .trim()
    .optional()
    .or(z.literal("")),
});
export type TMakeDecisionPayload = z.infer<typeof makeDecisionSchema>;


