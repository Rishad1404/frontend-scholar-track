import z from "zod";

export const loginZodSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .min(1, "Password is required"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  //   "Password must contain uppercase, lowercase and a number",
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;

export const registerZodSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .min(1, "Password is required"),
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    //   "Password must contain uppercase, lowercase and a number",
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const registerFieldSchemas = {
  name: registerZodSchema.shape.name,
  email: registerZodSchema.shape.email,
  password: registerZodSchema.shape.password,
  confirmPassword: registerZodSchema.shape.confirmPassword,
};

export type IRegisterPayload = z.infer<typeof registerZodSchema>;

export const adminRegisterZodSchema = z
  .object({
    // Personal info
    name: z
      .string()
      .min(5, "Name must be at least 5 characters")
      .max(100, "Name must be at most 100 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .min(1, "Password is required"),
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    //   "Password must contain uppercase, lowercase and a number",
    confirmPassword: z.string().min(1, "Please confirm your password"),

    // University info
    universityName: z
      .string()
      .min(10, "University name must be at least 10 characters")
      .max(255, "University name is too long"),
    website: z.url("Please enter a valid URL").or(z.literal("")),
    phone: z
      .string()
      .min(11, "Phone must be at least 11 characters")
      .max(15, "Phone must be at most 15 characters"),
    designation: z
      .string()
      .min(5, "Designation must be at least 5 characters")
      .max(100, "Designation is too long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const adminRegisterFieldSchemas = {
  name: adminRegisterZodSchema.shape.name,
  email: adminRegisterZodSchema.shape.email,
  password: adminRegisterZodSchema.shape.password,
  confirmPassword: adminRegisterZodSchema.shape.confirmPassword,
  universityName: adminRegisterZodSchema.shape.universityName,
  website: adminRegisterZodSchema.shape.website,
  phone: adminRegisterZodSchema.shape.phone,
  designation: adminRegisterZodSchema.shape.designation,
};

export type IAdminRegisterPayload = z.infer<typeof adminRegisterZodSchema>;

// -----------------------------------------------------------------------------------------------------------------------------
// ─── Verify Email (OTP) ───
export const verifyEmailZodSchema = z.object({
  email: z.email("Please enter a valid email"),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type IVerifyEmailPayload = z.infer<typeof verifyEmailZodSchema>;

// ─── Resend OTP ───---------------------------------------------------------------------------------------------------
export const resendOtpZodSchema = z.object({
  email: z.email("Please enter a valid email"),
});

export type IResendOtpPayload = z.infer<typeof resendOtpZodSchema>;

// ─── Forgot Password ───----------------------------------------------------------------------------
export const forgotPasswordZodSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export type IForgotPasswordPayload = z.infer<typeof forgotPasswordZodSchema>;

// ─── Reset Password ───-----------------------------------------------------------------------------
export const resetPasswordZodSchema = z
  .object({
    email: z.email("Invalid email address"),
    otp: z.string().length(6, "OTP must be exactly 6 digits"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type IResetPasswordPayload = z.infer<typeof resetPasswordZodSchema>;

export const resetPasswordFieldSchemas = {
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
};

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    // .regex(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    //   "Password must contain uppercase, lowercase and a number"
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"],
  });

export type TChangePasswordPayload = z.infer<typeof changePasswordSchema>;
