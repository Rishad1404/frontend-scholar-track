
import { z } from "zod";

export const updateUniversitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, "Name must be at least 5 characters")
    .max(255, "Name must be at most 255 characters")
    .or(z.literal(""))
    .optional(),

  website: z
    .string()
    .trim()
    .url("Website must be a valid URL")
    .or(z.literal(""))
    .optional(),
});

export type UpdateUniversityInput = z.infer<typeof updateUniversitySchema>;