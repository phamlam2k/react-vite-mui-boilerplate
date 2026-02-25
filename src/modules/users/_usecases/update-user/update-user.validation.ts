import { z } from "zod";

export const updateUserSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập không được để trống").optional(),
  email: z.string().email("Email không hợp lệ").optional(),
  firstName: z.string().min(1, "Họ không được để trống").optional(),
  lastName: z.string().min(1, "Tên không được để trống").optional(),
  role: z.enum(["user", "admin"]).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
