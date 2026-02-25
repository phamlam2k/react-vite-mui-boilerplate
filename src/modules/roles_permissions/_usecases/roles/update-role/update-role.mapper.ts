/**
 * 🟢 USE CASE LAYER - Mapper
 * Form → API request for update role
 */

import type { RoleUpdateRequestBody } from "@modules/roles_permissions/_api/roles/roles.type";
import type { UpdateRoleSchema } from "./update-role.validation";

export function mapUpdateRoleFormToApi(
  roleId: string,
  form: Partial<UpdateRoleSchema>
): RoleUpdateRequestBody {
  return {
    roleId,
    data: {
      name: form.name,
      description: form.description,
    },
  };
}
