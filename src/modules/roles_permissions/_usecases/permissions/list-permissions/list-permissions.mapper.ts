/**
 * 🟢 USE CASE LAYER - Mapper
 * DTO ↔ Domain for permissions list
 */

import type { Permission } from "@modules/roles_permissions/_api/permissions/permissions.type";
import type { PermissionItem } from "@modules/roles_permissions/_domain/permissions/permissions.model";

export function mapPermissionDtoToDomain(dto: Permission): PermissionItem {
  return {
    id: dto.id,
    key: dto.key,
    group: dto.group,
    description: dto.description,
  };
}

export function mapPermissionDtosToDomain(dtos: Permission[]): PermissionItem[] {
  return dtos.map(mapPermissionDtoToDomain);
}
