import { z } from "zod";

export const createInviteSchema = z
  .object({
    email: z
      .email("Please enter a valid email address"),
    role: z.enum(["DEPARTMENT_HEAD", "COMMITTEE_REVIEWER"]),
    departmentId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "DEPARTMENT_HEAD" && !data.departmentId) {
        return false;
      }
      return true;
    },
    {
      message: "Department is required for Department Head invites",
      path: ["departmentId"],
    }
  );

export const acceptInviteSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(255, "Name is too long"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      // .regex(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      //   "Password must contain uppercase, lowercase, and a number"
      // )
      ,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phone: z
      .string()
      .max(20, "Phone number is too long")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CreateInviteFormData = z.infer<typeof createInviteSchema>;
export type AcceptInviteFormData = z.infer<typeof acceptInviteSchema>;