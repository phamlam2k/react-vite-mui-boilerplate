/**
 * 🟢 USE CASE LAYER - Validation (consolidated)
 * Zod schemas for list filters, create form, update form
 */

import { z } from "zod";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
  MIN_SEARCH_LENGTH,
  FIRST_NAME_MAX_LENGTH,
  LAST_NAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  POSITION_TITLE_MAX_LENGTH,
  NATIONAL_ID_MAX_LENGTH,
  TAX_ID_MAX_LENGTH,
  PAY_GRADE_MAX_LENGTH,
  CURRENCY_MAX_LENGTH,
} from "@modules/employees/_domain/employees.rules";

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

const contractCreateSchema = z.object({
  type: z.enum([
    "probation",
    "fixed_term",
    "permanent",
    "part_time",
    "contractor",
  ]),
  startDate: z.string().min(1, "Ngày bắt đầu hợp đồng không được để trống"),
  endDate: z.string().optional().nullable(),
  baseSalary: z.coerce.number().positive("Lương cơ bản phải lớn hơn 0"),
  currency: z.string().min(1, "Đơn vị tiền tệ không được để trống").max(CURRENCY_MAX_LENGTH),
  paySchedule: z.enum(["monthly", "bi_weekly", "weekly"]),
  payGrade: z.string().max(PAY_GRADE_MAX_LENGTH).optional().nullable(),
});

export const createEmployeeSchema = z.object({
  firstName: z
    .string()
    .min(1, "Họ không được để trống")
    .max(FIRST_NAME_MAX_LENGTH, `Họ tối đa ${FIRST_NAME_MAX_LENGTH} ký tự`),
  lastName: z
    .string()
    .min(1, "Tên không được để trống")
    .max(LAST_NAME_MAX_LENGTH, `Tên tối đa ${LAST_NAME_MAX_LENGTH} ký tự`),
  email: z.string().email("Email không hợp lệ").max(EMAIL_MAX_LENGTH),
  phone: z.string().max(PHONE_MAX_LENGTH).optional().nullable(),
  gender: z
    .enum(["male", "female", "other", "prefer_not_to_say"])
    .optional(),
  dateOfBirth: z.string().optional(),
  nationalId: z.string().max(NATIONAL_ID_MAX_LENGTH).optional().nullable(),
  taxId: z.string().max(TAX_ID_MAX_LENGTH).optional().nullable(),
  orgUnitId: z.string().uuid("Chọn đơn vị công tác"),
  positionTitle: z
    .string()
    .min(1, "Chức vụ không được để trống")
    .max(POSITION_TITLE_MAX_LENGTH),
  managerId: z.string().uuid().optional().nullable(),
  hireDate: z.string().min(1, "Ngày vào làm không được để trống"),
  workMode: z.enum(["office", "remote", "hybrid"]),
  contract: contractCreateSchema,
});

export type CreateEmployeeSchema = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = z.object({
  firstName: z
    .string()
    .min(1, "Họ không được để trống")
    .max(FIRST_NAME_MAX_LENGTH)
    .optional(),
  lastName: z
    .string()
    .min(1, "Tên không được để trống")
    .max(LAST_NAME_MAX_LENGTH)
    .optional(),
  phone: z.string().max(PHONE_MAX_LENGTH).optional().nullable(),
  orgUnitId: z.string().uuid().optional(),
  positionTitle: z.string().max(POSITION_TITLE_MAX_LENGTH).optional(),
  managerId: z.string().uuid().optional().nullable(),
  status: z
    .enum(["probation", "active", "on_leave", "terminated"])
    .optional(),
  workMode: z.enum(["office", "remote", "hybrid"]).optional(),
  terminationDate: z.string().optional().nullable(),
});

export type UpdateEmployeeSchema = z.infer<typeof updateEmployeeSchema>;
