/**
 * 🟢 USE CASE LAYER - Port (Interface)
 * Defines what the use cases need from the outside.
 * Gateway (outer) implements this. Use cases depend only on this interface.
 */

import type {
  OrgUnit,
  OrgUnitCreateRequest,
  OrgUnitListResponse,
  OrgUnitUpdateRequestBody,
  OrgsListParams,
} from "@modules/organizations/_api/organizations.type";

export interface IOrganizationsPort {
  getList(params: OrgsListParams): Promise<OrgUnitListResponse>;
  create(data: OrgUnitCreateRequest): Promise<OrgUnit>;
  getById(orgId: string): Promise<OrgUnit>;
  update(payload: OrgUnitUpdateRequestBody): Promise<OrgUnit>;
  delete(orgId: string): Promise<void>;
  getChildren(orgId: string): Promise<OrgUnitListResponse>;
}
