/**
 * 🟢 USE CASE LAYER - Validation
 * Zod schemas for employees list filters
 */

import { z } from "zod";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  MIN_SEARCH_LENGTH,
} from "../../_domain/employees.rules";

export const employeesFiltersSchema = z.object({
  search: z
    .string()
    .min(MIN_SEARCH_LENGTH, `Tìm kiếm tối thiểu ${MIN_SEARCH_LENGTH} ký tự`)
    .optional()
    .or(z.literal("")),
  orgUnitId: z.string().uuid().optional().or(z.literal("")),
  status: z
    .enum(["probation", "active", "on_leave", "terminated", "all"])
    .optional()
    .default("all"),
  workMode: z
    .enum(["office", "remote", "hybrid", "all"])
    .optional()
    .default("all"),
  managerId: z.string().uuid().optional().or(z.literal("")),
  page: z.number().int().positive().default(DEFAULT_PAGE),
  pageSize: z
    .number()
    .int()
    .min(MIN_PAGE_SIZE)
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE),
});

export type EmployeesFiltersSchema = z.infer<typeof employeesFiltersSchema>;
