/**
 * 🟢 USE CASE LAYER - Validation
 * Zod schema for create role form
 */

import { z } from "zod";
import {
  ROLE_DESCRIPTION_MAX_LENGTH,
  ROLE_NAME_MAX_LENGTH,
  ROLE_NAME_MIN_LENGTH,
} from "@modules/roles_permissions/_domain/roles/roles.rules";

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(
      ROLE_NAME_MIN_LENGTH,
      `Tên vai trò tối thiểu ${ROLE_NAME_MIN_LENGTH} ký tự`
    )
    .max(
      ROLE_NAME_MAX_LENGTH,
      `Tên vai trò tối đa ${ROLE_NAME_MAX_LENGTH} ký tự`
    ),
  description: z
    .string()
    .max(ROLE_DESCRIPTION_MAX_LENGTH)
    .optional()
    .nullable(),
  permissionIds: z.array(z.string().uuid()).optional().default([]),
});

export type CreateRoleSchema = z.infer<typeof createRoleSchema>;
