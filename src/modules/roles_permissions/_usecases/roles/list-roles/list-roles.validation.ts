/**
 * 🟢 USE CASE LAYER - Validation
 * Zod schemas for roles list filters
 */

import { z } from "zod";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  MIN_SEARCH_LENGTH,
} from "@modules/roles_permissions/_domain/roles/roles.rules";

export const rolesFiltersSchema = z.object({
  search: z
    .string()
    .min(MIN_SEARCH_LENGTH, `Tìm kiếm tối thiểu ${MIN_SEARCH_LENGTH} ký tự`)
    .optional()
    .or(z.literal("")),
  page: z.number().int().positive().default(DEFAULT_PAGE),
  pageSize: z
    .number()
    .int()
    .min(MIN_PAGE_SIZE)
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE),
});

export type RolesFiltersSchema = z.infer<typeof rolesFiltersSchema>;
