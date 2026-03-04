/**
 * 🟢 USE CASE LAYER - Orchestration (Class)
 * Depends only on IRolesPort (injected). Optional ICurrentUserPort for authz.
 */

import type { IRolesPort } from "@modules/roles_permissions/_usecases/roles/roles.port";
import type { ICurrentUserPort } from "@shared/ports/current-user.port";
import { ForbiddenError, NotFoundError } from "@shared/errors/app.errors";
import type {
  RoleItem,
  RolesFilters,
  RolesList,
} from "@modules/roles_permissions/_domain/roles/roles.model";
import type { PermissionItem } from "@modules/roles_permissions/_domain/permissions/permissions.model";
import {
  rolesFiltersSchema,
  createRoleSchema,
  type CreateRoleSchema,
  type UpdateRoleSchema,
} from "./roles.validations";
import {
  mapFiltersToRoleListRequest,
  mapRoleDtoToDomain,
  mapRoleDtosToDomain,
  mapCreateRoleFormToApi,
  mapUpdateRoleFormToApi,
} from "./roles.mappers";
import { mapPermissionDtosToDomain } from "@modules/roles_permissions/_usecases/permissions/permissions.mappers";
import { pickBy } from "lodash-es";
import {
  canDeleteRole,
  canCreateRole,
} from "@modules/roles_permissions/_domain/roles/roles.rules";

export class RolesUseCases {
  private readonly api: IRolesPort;
  private readonly currentUser: ICurrentUserPort | null;

  constructor(api: IRolesPort, currentUser: ICurrentUserPort | null = null) {
    this.api = api;
    this.currentUser = currentUser;
  }

  private getPermissions(): string[] {
    return this.currentUser?.getPermissions() ?? [];
  }

  async getList(filters: RolesFilters): Promise<RolesList> {
    const validated = rolesFiltersSchema.parse(filters);
    const params = mapFiltersToRoleListRequest(validated);
    const response = await this.api.listRoles(params);
    return {
      data: mapRoleDtosToDomain(response.data),
      meta: response.meta,
    };
  }

  async create(formData: CreateRoleSchema): Promise<RoleItem> {
    if (this.currentUser && !canCreateRole(this.getPermissions()))
      throw new ForbiddenError("Bạn không có quyền tạo vai trò");
    const validated = createRoleSchema.parse(formData);
    const request = mapCreateRoleFormToApi(validated);
    const response = await this.api.createRole(request);
    return mapRoleDtoToDomain(response);
  }

  async getById(roleId: string): Promise<RoleItem> {
    if (!roleId) throw new NotFoundError("Vai trò không tồn tại");
    const response = await this.api.getRoleById(roleId);
    return mapRoleDtoToDomain(response);
  }

  async update(
    roleId: string,
    formData: Partial<UpdateRoleSchema>
  ): Promise<RoleItem> {
    const cleaned = pickBy(
      formData,
      (v): v is NonNullable<typeof v> => v !== undefined
    );
    const payload = mapUpdateRoleFormToApi(roleId, cleaned);
    const response = await this.api.updateRole(payload);
    return mapRoleDtoToDomain(response);
  }

  async delete(roleId: string): Promise<void> {
    if (this.currentUser && !canDeleteRole(this.getPermissions()))
      throw new ForbiddenError("Bạn không có quyền xóa vai trò");
    if (!roleId) throw new NotFoundError("Vai trò không tồn tại");
    await this.api.deleteRole(roleId);
  }

  async getRolePermissions(roleId: string): Promise<PermissionItem[]> {
    if (!roleId) throw new NotFoundError("Vai trò không tồn tại");
    const response = await this.api.getRolePermissions(roleId);
    return mapPermissionDtosToDomain(response.data);
  }

  async setRolePermissions(
    roleId: string,
    permissionIds: string[]
  ): Promise<PermissionItem[]> {
    const response = await this.api.setRolePermissions(roleId, {
      permissionIds,
    });
    return mapPermissionDtosToDomain(response.data);
  }
}
