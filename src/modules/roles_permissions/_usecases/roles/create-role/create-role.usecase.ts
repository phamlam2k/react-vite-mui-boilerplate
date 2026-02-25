/**
 * 🟢 USE CASE LAYER - Business Logic (Pure)
 * Orchestrates create role logic WITHOUT framework dependencies.
 * Depends only on IRolesPort (inner); gateway is injected by adapter.
 */

import type { IRolesPort } from "@modules/roles_permissions/_usecases/roles/roles.port";
import type { RoleItem } from "@modules/roles_permissions/_domain/roles/roles.model";
import {
  createRoleSchema,
  type CreateRoleSchema,
} from "./create-role.validation";
import { mapCreateRoleFormToApi } from "./create-role.mapper";
import { mapRoleDtoToDomain } from "../list-roles/list-roles.mapper";

export async function createRoleUseCase(
  api: IRolesPort["createRole"],
  formData: CreateRoleSchema
): Promise<RoleItem> {
  const validated = createRoleSchema.parse(formData);
  const request = mapCreateRoleFormToApi(validated);
  const response = await api(request);

  return mapRoleDtoToDomain(response);
}
