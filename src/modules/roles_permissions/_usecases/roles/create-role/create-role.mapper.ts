/**
 * 🟢 USE CASE LAYER - Mapper
 * Form → API request for create role
 */

import type { RoleCreateRequest } from "@modules/roles_permissions/_api/roles/roles.type";
import type { CreateRoleSchema } from "./create-role.validation";

export function mapCreateRoleFormToApi(
  form: CreateRoleSchema
): RoleCreateRequest {
  return {
    name: form.name.trim(),
    description: form.description?.trim() || null,
    permissionIds: form.permissionIds ?? [],
  };
}
