import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
// @ts-expect-error: Type incompatibility between Zod versions, suppressing until resolver or schema updated
export const loginSchemaResolver = zodResolver(loginSchema);
