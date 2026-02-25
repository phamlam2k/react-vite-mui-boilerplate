/**
 * 🟢 USE CASE LAYER - Business Logic (Pure)
 * Get full permissions catalog (for role configuration UI).
 * Depends only on IPermissionsPort (inner); gateway is injected by adapter.
 */

import type { IPermissionsPort } from "@modules/roles_permissions/_usecases/permissions/permissions.port";
import type { PermissionItem } from "@modules/roles_permissions/_domain/permissions/permissions.model";
import { mapPermissionDtosToDomain } from "../../permissions/list-permissions/list-permissions.mapper";

export async function getPermissionsCatalogUseCase(
  api: IPermissionsPort["listPermissions"],
  params?: { group?: string }
): Promise<PermissionItem[]> {
  const response = await api(params);
  return mapPermissionDtosToDomain(response.data);
}
