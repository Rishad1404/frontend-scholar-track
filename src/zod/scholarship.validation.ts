import { z } from "zod";

const documentTypeValues = [
  "TRANSCRIPT",
  "INCOME_CERTIFICATE",
  "NATIONAL_ID",
  "PERSONAL_ESSAY",
  "RECOMMENDATION_LETTER",
  "OTHER",
] as const;

const scholarshipStatusValues = [
  "DRAFT",
  "ACTIVE",
  "PAUSED",
  "CLOSED",
  "CANCELLED",
] as const;

export const createScholarshipSchema = z.object({
  title: z
    .string("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must be at most 255 characters")
    .trim(),
  description: z
    .string()
    .max(5000, "Description must be at most 5000 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  departmentId: z.string().optional().or(z.literal("")),
  levelId: z.string().optional().or(z.literal("")),
  totalAmount: z
    .number("Total amount must be a number")
    .positive("Total amount must be positive"),
  amountPerStudent: z
    .number("Amount per student must be a number")
    .positive("Amount per student must be positive"),
  quota: z
    .number("Quota must be a number")
    .int("Quota must be a whole number")
    .positive("Quota must be positive"),
  deadline: z
    .string("Deadline must be a valid date string")
    .refine(
      (val) => new Date(val) > new Date(),
      "Deadline must be in the future",
    ),
  requiredDocTypes: z
    .array(z.enum(documentTypeValues))
    .min(1, "At least one document type is required")
    .optional(),
  minGpa: z.number().min(0).max(4).optional().or(z.literal(0)),
  minCgpa: z.number().min(0).max(4).optional().or(z.literal(0)),
  financialNeedRequired: z.boolean().optional().default(false),
});

export const updateScholarshipSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title must be at most 255 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(5000, "Description must be at most 5000 characters")
    .trim()
    .optional()
    .or(z.literal("")),
  departmentId: z.string().nullable().optional(),
  levelId: z.string().nullable().optional(),
  totalAmount: z.number().positive().optional(),
  amountPerStudent: z.number().positive().optional(),
  quota: z.number().int().positive().optional(),
  deadline: z.string().optional(),
  requiredDocTypes: z.array(z.enum(documentTypeValues)).min(1).optional(),
  minGpa: z.number().min(0).max(4).nullable().optional(),
  minCgpa: z.number().min(0).max(4).nullable().optional(),
  financialNeedRequired: z.boolean().optional(),
});

export const changeScholarshipStatusSchema = z.object({
  status: z.enum(scholarshipStatusValues, "Invalid status value"),
});

export type CreateScholarshipInput = z.infer<typeof createScholarshipSchema>;
export type UpdateScholarshipInput = z.infer<typeof updateScholarshipSchema>;
export type ChangeScholarshipStatusInput = z.infer<
  typeof changeScholarshipStatusSchema
>;