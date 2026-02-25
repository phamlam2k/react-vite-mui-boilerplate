/**
 * 🟢 USE CASE LAYER - Validation
 * Zod schema for update employee form
 */

import { z } from "zod";
import {
  FIRST_NAME_MAX_LENGTH,
  LAST_NAME_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  POSITION_TITLE_MAX_LENGTH,
} from "../../_domain/employees.rules";

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
