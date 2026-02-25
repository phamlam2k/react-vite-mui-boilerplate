import { zodResolver } from "@hookform/resolvers/zod";
import { MIN_PASSWORD_LENGTH } from "@modules/auth/_domain/auth.rules";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự`
    ),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export const loginSchemaResolver = zodResolver(loginSchema);
