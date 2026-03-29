// src/zod/academicTerm.validation.ts

import { z } from "zod";

export const createAcademicTermSchema = z.object({
  name: z
    .string("Academic term is required")
    .trim()
    .min(5, "Name must be at least 5 characters")
    .max(20, "Name must be at most 20 characters"),
});

export type CreateAcademicTermInput = z.infer<typeof createAcademicTermSchema>;