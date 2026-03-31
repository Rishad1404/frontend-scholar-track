
import { z } from "zod";

export const updateDepartmentHeadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .or(z.literal(""))
    .optional(),

  phone: z
    .string()
    .trim()
    .min(11, "Phone must be at least 11 digits")
    .max(15, "Phone must be at most 15 digits")
    .or(z.literal(""))
    .optional(),

  designation: z
    .string()
    .trim()
    .max(100, "Designation must be at most 100 characters")
    .or(z.literal(""))
    .optional(),
});

export type UpdateDepartmentHeadInput = z.infer<typeof updateDepartmentHeadSchema>;