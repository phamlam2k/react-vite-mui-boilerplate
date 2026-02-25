/**
 * 🟢 USE CASE LAYER - Business Logic (Pure)
 * Orchestrates update role logic WITHOUT framework dependencies.
 * Depends only on IRolesPort (inner); gateway is injected by adapter.
 */

import type { IRolesPort } from "@modules/roles_permissions/_usecases/roles/roles.port";
import type { RoleItem } from "@modules/roles_permissions/_domain/roles/roles.model";
import type { UpdateRoleSchema } from "./update-role.validation";
import { pickBy } from "lodash-es";
import { mapUpdateRoleFormToApi } from "./update-role.mapper";
import { mapRoleDtoToDomain } from "../list-roles/list-roles.mapper";

export async function updateRoleUseCase(
  api: IRolesPort["updateRole"],
  roleId: string,
  formData: Partial<UpdateRoleSchema>
): Promise<RoleItem> {
  const cleaned = pickBy(
    formData,
    (v): v is NonNullable<typeof v> => v !== undefined
  );
  const payload = mapUpdateRoleFormToApi(roleId, cleaned);
  const response = await api(payload);

  return mapRoleDtoToDomain(response);
}
