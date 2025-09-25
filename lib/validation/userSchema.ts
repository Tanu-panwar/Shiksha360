import { z } from "zod";

export const userSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters"),

  email: z.string()
    .email("Invalid email format"),

  password: z.string()
    .min(6, "Password must be at least 6 characters"),

  phone: z.string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),

  role: z.enum(["EMPLOYEE", "MANAGER", "HR", "ADMIN"]),

  managerId: z.string()
    .cuid(),  // means: can be UUID, null, or undefined

  departmentId: z.string()
    .uuid()
    .nullable()
    .optional(),

  address: z.string()
    .nullable()
    .optional(),

  joinDate: z.coerce.date()
    .nullable()
    .optional(),

  salary: z.coerce.number()
    .nullable()
    .optional(),

  notes: z.string()
    .nullable()
    .optional(),
});
