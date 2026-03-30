// src/zod/department.validation.ts

import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z
    .string("Department name is required")
    .trim()
    .min(7, "Name must be at least 7 characters")
    .max(255, "Name must be at most 255 characters"),
});

export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(7, "Name must be at least 7 characters")
    .max(255, "Name must be at most 255 characters"),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;