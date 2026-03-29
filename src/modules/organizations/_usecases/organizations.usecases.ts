/**
 * 🟢 USE CASE LAYER - Orchestration
 * Depends only on IOrganizationsPort (injected). Optional ICurrentUserPort for authz.
 */

import type { IOrganizationsPort } from "./organizations.port";
import type { ICurrentUserPort } from "@shared/ports/current-user.port";
import { ForbiddenError, NotFoundError } from "@shared/errors/app.errors";
import type {
  OrgUnitItem,
  OrgUnitsList,
  OrgsFilters,
} from "@modules/organizations/_domain/organizations.model";
import {
  canCreateOrg,
  canDeleteOrg,
  canEditOrg,
} from "@modules/organizations/_domain/organizations.rule";
import {
  orgsFiltersSchema,
  createOrgSchema,
  updateOrgSchema,
  type CreateOrgSchema,
  type UpdateOrgSchema,
} from "./organizations.validations";
import {
  mapFiltersToApiParams,
  mapOrgDtoToDomain,
  mapOrgDtosToDomain,
  mapCreateOrgFormToApi,
  mapUpdateOrgFormToApi,
} from "./organizations.mappers";

export class OrganizationsUseCases {
  private readonly api: IOrganizationsPort;
  private readonly currentUser: ICurrentUserPort | null;

  constructor(
    api: IOrganizationsPort,
    currentUser: ICurrentUserPort | null = null
  ) {
    this.api = api;
    this.currentUser = currentUser;
  }

  private getPermissions(): string[] {
    return this.currentUser?.getPermissions() ?? [];
  }

  private requirePermission(
    check: (perms: string[]) => boolean,
    msg: string
  ): void {
    if (this.currentUser && !check(this.getPermissions())) {
      throw new ForbiddenError(msg);
    }
  }

  async getList(filters: OrgsFilters): Promise<OrgUnitsList> {
    const validated = orgsFiltersSchema.parse(filters);
    const params = mapFiltersToApiParams(validated);
    const response = await this.api.getList(params);
    return {
      data: mapOrgDtosToDomain(response.data),
      meta: response.meta,
    };
  }

  async create(formData: CreateOrgSchema): Promise<OrgUnitItem> {
    this.requirePermission(
      canCreateOrg,
      "Bạn không có quyền tạo đơn vị tổ chức"
    );
    const validated = createOrgSchema.parse(formData);
    const request = mapCreateOrgFormToApi(validated);
    const response = await this.api.create(request);
    return mapOrgDtoToDomain(response);
  }

  async getById(orgId: string): Promise<OrgUnitItem> {
    if (!orgId) throw new NotFoundError("Đơn vị tổ chức không tồn tại");
    const response = await this.api.getById(orgId);
    return mapOrgDtoToDomain(response);
  }

  async update(
    orgId: string,
    formData: Partial<UpdateOrgSchema>
  ): Promise<OrgUnitItem> {
    this.requirePermission(
      canEditOrg,
      "Bạn không có quyền cập nhật đơn vị tổ chức"
    );
    if (!orgId) throw new NotFoundError("Đơn vị tổ chức không tồn tại");
    const validated = updateOrgSchema.partial().parse(formData);
    const payload = mapUpdateOrgFormToApi(orgId, validated);
    const response = await this.api.update(payload);
    return mapOrgDtoToDomain(response);
  }

  async delete(orgId: string): Promise<void> {
    this.requirePermission(
      canDeleteOrg,
      "Bạn không có quyền xóa đơn vị tổ chức"
    );
    if (!orgId) throw new NotFoundError("Đơn vị tổ chức không tồn tại");
    await this.api.delete(orgId);
  }

  async getChildren(orgId: string): Promise<OrgUnitItem[]> {
    if (!orgId) throw new NotFoundError("Đơn vị tổ chức không tồn tại");
    const response = await this.api.getChildren(orgId);
    return mapOrgDtosToDomain(response.data);
  }
}
