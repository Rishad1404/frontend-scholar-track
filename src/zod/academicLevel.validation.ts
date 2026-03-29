import { z } from "zod";

export const createAcademicLevelSchema = z.object({
  name: z
    .string("Academic level is required")
    .trim()
    .min(5, "Name must be at least 5 characters")
    .max(20, "Name must be at most 20 characters"),
});

export type CreateAcademicLevelInput = z.infer<typeof createAcademicLevelSchema>;