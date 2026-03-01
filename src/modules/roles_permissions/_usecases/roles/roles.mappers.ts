/**
 * 🟢 USE CASE LAYER - Mappers (consolidated)
 */

import type {
  Role,
  RoleListRequest,
  RoleCreateRequest,
  RoleUpdateRequestBody,
} from "@modules/roles_permissions/_api/roles/roles.type";
import type { RoleItem } from "@modules/roles_permissions/_domain/roles/roles.model";
import type {
  RolesFiltersSchema,
  CreateRoleSchema,
  UpdateRoleSchema,
} from "./roles.validations";

export function mapFiltersToRoleListRequest(
  filters: RolesFiltersSchema
): RoleListRequest {
  const result: RoleListRequest = {};
  if (filters.page != null) result.page = filters.page;
  if (filters.pageSize != null) result.pageSize = filters.pageSize;
  if (filters.search != null && filters.search !== "")
    result.search = filters.search;
  return result;
}

export function mapRoleDtoToDomain(dto: Role): RoleItem {
  return {
    id: dto.id,
    tenantId: dto.tenantId,
    name: dto.name,
    description: dto.description ?? null,
    isSystem: dto.isSystem,
    permissionCount: dto.permissionCount ?? 0,
    permissions: undefined,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function mapRoleDtosToDomain(dtos: Role[]): RoleItem[] {
  return dtos.map(mapRoleDtoToDomain);
}

export function mapCreateRoleFormToApi(
  form: CreateRoleSchema
): RoleCreateRequest {
  return {
    name: form.name.trim(),
    description: form.description?.trim() || null,
    permissionIds: form.permissionIds ?? [],
  };
}

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
