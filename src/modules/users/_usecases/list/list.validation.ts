/**
 * 🟢 USE CASE LAYER - Validation
 * Zod schemas for filters validation
 */

import { z } from "zod";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_BY,
  DEFAULT_SORT_ORDER,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  MIN_SEARCH_LENGTH,
} from "../../_domain/users.rules";

/**
 * Schema for users list filters
 */
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
