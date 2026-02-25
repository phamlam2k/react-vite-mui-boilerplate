/**
 * 🟢 USE CASE LAYER - Validation
 * Zod schema for update role form
 */

import { z } from "zod";
import {
  ROLE_DESCRIPTION_MAX_LENGTH,
  ROLE_NAME_MAX_LENGTH,
  ROLE_NAME_MIN_LENGTH,
} from "@modules/roles_permissions/_domain/roles/roles.rules";

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
