/**
 * 🟢 USE CASE LAYER - Business Logic (Pure)
 * Orchestrates list roles logic WITHOUT framework dependencies.
 * Depends only on IRolesPort (inner); gateway is injected by adapter.
 */

import type { IRolesPort } from "@modules/roles_permissions/_usecases/roles/roles.port";
import type {
  RolesFilters,
  RolesList,
} from "@modules/roles_permissions/_domain/roles/roles.model";
import { rolesFiltersSchema } from "./list-roles.validation";
import { mapFiltersToRoleListRequest } from "./list-roles.mapper";
import { mapRoleDtosToDomain } from "./list-roles.mapper";

export async function getRolesListUseCase(
  api: IRolesPort["listRoles"],
  filters: RolesFilters
): Promise<RolesList> {
  const validated = rolesFiltersSchema.parse(filters);
  const params = mapFiltersToRoleListRequest(validated);
  const response = await api(params);

  return {
    data: mapRoleDtosToDomain(response.data),
    meta: response.meta,
  };
}
