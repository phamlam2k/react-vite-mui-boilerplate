/**
 * 🟢 USE CASE LAYER - Validations
 * Zod schemas — dùng business invariants từ Domain làm nguồn duy nhất.
 * Pagination/search defaults thuộc application layer, được định nghĩa tại đây.
 */

import { z } from "zod";
import {
  ORG_CODE_MAX_LENGTH,
  ORG_DESCRIPTION_MAX_LENGTH,
  ORG_NAME_MAX_LENGTH,
  ORG_NAME_MIN_LENGTH,
} from "@modules/organizations/_domain/organizations.rule";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  MIN_SEARCH_LENGTH,
} from "@shared/constants/paginations";

const orgTypeSchema = z.enum([
  "company",
  "business_unit",
  "department",
  "team",
]);

export const orgsFiltersSchema = z.object({
  search: z
    .string()
    .min(MIN_SEARCH_LENGTH, `Tìm kiếm tối thiểu ${MIN_SEARCH_LENGTH} ký tự`)
    .optional()
    .or(z.literal("")),
  type: orgTypeSchema.or(z.literal("all")).optional(),
  isActive: z.boolean().or(z.literal("all")).optional(),
  page: z.number().int().positive().default(DEFAULT_PAGE),
  pageSize: z
    .number()
    .int()
    .min(MIN_PAGE_SIZE)
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE),
});

export type OrgsFiltersSchema = z.infer<typeof orgsFiltersSchema>;

export const createOrgSchema = z.object({
  name: z
    .string()
    .min(ORG_NAME_MIN_LENGTH, "Tên đơn vị không được để trống")
    .max(ORG_NAME_MAX_LENGTH, `Tên đơn vị tối đa ${ORG_NAME_MAX_LENGTH} ký tự`),
  type: orgTypeSchema,
  parentId: z.string().uuid("ID đơn vị cha không hợp lệ").nullable().optional(),
  code: z
    .string()
    .max(ORG_CODE_MAX_LENGTH, `Mã tối đa ${ORG_CODE_MAX_LENGTH} ký tự`)
    .optional()
    .or(z.literal("")),
  description: z.string().max(ORG_DESCRIPTION_MAX_LENGTH).nullable().optional(),
  headEmployeeId: z.string().uuid().nullable().optional(),
});

export type CreateOrgSchema = z.infer<typeof createOrgSchema>;

export const updateOrgSchema = z.object({
  name: z.string().min(ORG_NAME_MIN_LENGTH).max(ORG_NAME_MAX_LENGTH).optional(),
  code: z.string().max(ORG_CODE_MAX_LENGTH).optional().or(z.literal("")),
  description: z.string().max(ORG_DESCRIPTION_MAX_LENGTH).nullable().optional(),
  headEmployeeId: z.string().uuid().nullable().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateOrgSchema = z.infer<typeof updateOrgSchema>;
