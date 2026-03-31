import { z } from "zod";

export const changeAcademicStatusSchema = z.object({
  academicStatus: z.enum(
    ["REGULAR", "PROBATION", "SUSPENDED", "DROPPED_OUT"],
    "You must select a valid academic status",
  ),
});

export const deleteStudentSchema = z.object({
  confirm: z.boolean().refine((val) => val === true, {
    message: "You must confirm deletion",
  }),
});

export type TChangeAcademicStatusPayload = z.infer<
  typeof changeAcademicStatusSchema
>;
export type TDeleteStudentPayload = z.infer<typeof deleteStudentSchema>;