/**
 * 🟢 USE CASE LAYER - Orchestration (Class)
 * Depends only on IPermissionsPort (injected).
 */

import type { IPermissionsPort } from "@modules/roles_permissions/_usecases/permissions/permissions.port";
import type { PermissionItem } from "@modules/roles_permissions/_domain/permissions/permissions.model";
import { mapPermissionDtosToDomain } from "./permissions.mappers";

export class PermissionsUseCases {
  private readonly api: IPermissionsPort;

  constructor(api: IPermissionsPort) {
    this.api = api;
  }

  async getCatalog(params?: { group?: string }): Promise<PermissionItem[]> {
    const response = await this.api.listPermissions(params);
    return mapPermissionDtosToDomain(response.data);
  }
}
