/**
 * 🟢 USE CASE LAYER - Mappers
 * DTO ↔ Domain and Form → API transformations
 */

import type {
  OrgUnit,
  OrgUnitCreateRequest,
  OrgUnitUpdateRequestBody,
  OrgsListParams,
} from "@modules/organizations/_api/organizations.type";
import type { OrgUnitItem, OrgsFilters } from "@modules/organizations/_domain/organizations.model";
import type {
  CreateOrgSchema,
  OrgsFiltersSchema,
  UpdateOrgSchema,
} from "./organizations.validations";

// DTO → Domain
export function mapOrgDtoToDomain(dto: OrgUnit): OrgUnitItem {
  return {
    id: dto.id,
    tenantId: dto.tenantId,
    name: dto.name,
    type: dto.type,
    parentId: dto.parentId ?? null,
    code: dto.code ?? null,
    description: dto.description ?? null,
    isActive: dto.isActive,
    headEmployeeId: dto.headEmployeeId ?? null,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function mapOrgDtosToDomain(dtos: OrgUnit[]): OrgUnitItem[] {
  return dtos.map(mapOrgDtoToDomain);
}

// Domain Filters → API params (strip empty/all values)
export function mapFiltersToApiParams(filters: OrgsFiltersSchema): OrgsListParams {
  const params: OrgsListParams = {
    page: filters.page,
    pageSize: filters.pageSize,
  };
  if (filters.search) params.search = filters.search;
  if (filters.type && filters.type !== "all") params.type = filters.type;
  if (filters.isActive !== undefined && filters.isActive !== "all") {
    params.isActive = filters.isActive as boolean;
  }
  return params;
}

// Form → API DTO (create)
export function mapCreateOrgFormToApi(form: CreateOrgSchema): OrgUnitCreateRequest {
  return {
    name: form.name.trim(),
    type: form.type,
    parentId: form.parentId ?? null,
    code: form.code?.trim() || undefined,
    description: form.description?.trim() || null,
    headEmployeeId: form.headEmployeeId ?? null,
  };
}

// Form → API DTO (update)
export function mapUpdateOrgFormToApi(
  orgId: string,
  form: Partial<UpdateOrgSchema>
): OrgUnitUpdateRequestBody {
  return {
    orgId,
    data: {
      name: form.name,
      code: form.code?.trim() || undefined,
      description: form.description,
      headEmployeeId: form.headEmployeeId,
      isActive: form.isActive,
    },
  };
}

// Default filters (application-level, for UI reset)
export function makeDefaultFilters(): OrgsFilters {
  return { page: 1, pageSize: 20, search: "", type: "all", isActive: "all" };
}
