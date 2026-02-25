/**
 * 🟢 USE CASE LAYER - Validation
 * Zod schema for create user form
 */

import { z } from "zod";
import {
  FIRST_NAME_MAX_LENGTH,
  LAST_NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_PATTERN,
} from "../../_domain/users.rules";
import { passwordWithConfirmSchema } from "@shared/validations/password.validation";

/**
 * Schema for create user form
 * Dùng passwordWithConfirmSchema (password + confirmPassword) từ shared, extend thêm user fields
 */
export const createUserSchema = passwordWithConfirmSchema({
  minLength: PASSWORD_MIN_LENGTH,
  maxLength: PASSWORD_MAX_LENGTH,
}).safeExtend({
  username: z
    .string()
    .min(USERNAME_MIN_LENGTH, `Username tối thiểu ${USERNAME_MIN_LENGTH} ký tự`)
    .max(USERNAME_MAX_LENGTH, `Username tối đa ${USERNAME_MAX_LENGTH} ký tự`)
    .regex(
      USERNAME_PATTERN,
      "Username chỉ chứa chữ thường, số và dấu gạch dưới"
    ),
  email: z.string().email("Email không hợp lệ"),
  firstName: z
    .string()
    .min(1, "Họ không được để trống")
    .max(FIRST_NAME_MAX_LENGTH, `Họ tối đa ${FIRST_NAME_MAX_LENGTH} ký tự`),
  lastName: z
    .string()
    .min(1, "Tên không được để trống")
    .max(LAST_NAME_MAX_LENGTH, `Tên tối đa ${LAST_NAME_MAX_LENGTH} ký tự`),
  role: z.enum(["user", "admin"]),
  isActive: z.boolean().default(true),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
