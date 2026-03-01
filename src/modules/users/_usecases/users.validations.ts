import { z } from "zod";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  MIN_SEARCH_LENGTH,
  FIRST_NAME_MAX_LENGTH,
  LAST_NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_PATTERN,
} from "@modules/users/_domain/users.rules";
import { passwordWithConfirmSchema } from "@shared/validations/password.validation";

export const usersFiltersSchema = z.object({
  search: z
    .string()
    .min(MIN_SEARCH_LENGTH, `Tìm kiếm tối thiểu ${MIN_SEARCH_LENGTH} ký tự`)
    .optional()
    .or(z.literal("")),
  role: z.enum(["user", "admin", "all"]).optional().default("all"),
  isActive: z
    .union([z.boolean(), z.literal("all")])
    .optional()
    .default("all"),
  page: z.number().int().positive().default(DEFAULT_PAGE),
  pageSize: z
    .number()
    .int()
    .min(MIN_PAGE_SIZE)
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE),
  sortBy: z
    .enum(["username", "email", "createdAt", "lastLoginAt"])
    .optional()
    .default(DEFAULT_SORT_BY as "createdAt"),
  sortOrder: z
    .enum(["asc", "desc"])
    .optional()
    .default(DEFAULT_SORT_ORDER as "desc"),
});

export type UsersFiltersSchema = z.infer<typeof usersFiltersSchema>;

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
  roleIds: z.array(z.string()),
  isActive: z.boolean().default(true),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập không được để trống").optional(),
  email: z.string().email("Email không hợp lệ").optional(),
  firstName: z.string().min(1, "Họ không được để trống").optional(),
  lastName: z.string().min(1, "Tên không được để trống").optional(),
  role: z.enum(["user", "admin"]).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
