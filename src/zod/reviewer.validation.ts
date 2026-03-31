// src/zod/reviewer.validation.ts

import { z } from "zod";

export const createReviewerSchema = z.object({
  name: z
    .string("Name must be a string")
    .trim()
    .min(5, "Name must be at least 5 characters")
    .max(100, "Name must be at most 100 characters"),

  email: z
    .string("Email must be a string")
    .trim()
    .email("Invalid email address"),

  password: z
    .string("Password must be a string")
    .min(8, "Password must be at least 8 characters"),

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

  expertise: z
    .string()
    .trim()
    .max(255, "Expertise must be at most 255 characters")
    .or(z.literal(""))
    .optional(),
});

export const updateReviewerSchema = z.object({
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

  expertise: z
    .string()
    .trim()
    .max(255, "Expertise must be at most 255 characters")
    .or(z.literal(""))
    .optional(),
});

export type CreateReviewerInput = z.infer<typeof createReviewerSchema>;
export type UpdateReviewerInput = z.infer<typeof updateReviewerSchema>;