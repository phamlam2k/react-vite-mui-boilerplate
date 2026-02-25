/**
 * 🟢 USE CASE LAYER - Validation
 * Zod schema for create employee form (including contract)
 */

import { z } from "zod";
import {
  FIRST_NAME_MAX_LENGTH,
  LAST_NAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  POSITION_TITLE_MAX_LENGTH,
  NATIONAL_ID_MAX_LENGTH,
  TAX_ID_MAX_LENGTH,
  PAY_GRADE_MAX_LENGTH,
  CURRENCY_MAX_LENGTH,
} from "../../_domain/employees.rules";

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
