/**
 * 🟢 USE CASE LAYER - Validation (consolidated)
 */

import { z } from "zod";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  MIN_SEARCH_LENGTH,
  ROLE_DESCRIPTION_MAX_LENGTH,
  ROLE_NAME_MAX_LENGTH,
  ROLE_NAME_MIN_LENGTH,
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

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(ROLE_NAME_MIN_LENGTH, `Tên vai trò tối thiểu ${ROLE_NAME_MIN_LENGTH} ký tự`)
    .max(ROLE_NAME_MAX_LENGTH, `Tên vai trò tối đa ${ROLE_NAME_MAX_LENGTH} ký tự`),
  description: z
    .string()
    .max(ROLE_DESCRIPTION_MAX_LENGTH)
    .optional()
    .nullable(),
  permissionIds: z.array(z.string().uuid()).optional().default([]),
});

export type CreateRoleSchema = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = z.object({
  name: z
    .string()
    .min(ROLE_NAME_MIN_LENGTH)
    .max(ROLE_NAME_MAX_LENGTH)
    .optional(),
  description: z
    .string()
    .max(ROLE_DESCRIPTION_MAX_LENGTH)
    .optional()
    .nullable(),
});

export type UpdateRoleSchema = z.infer<typeof updateRoleSchema>;
