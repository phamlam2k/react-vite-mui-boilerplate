/**
 * DTOs — sourced from OpenAPI contract
 */

import type { components, operations } from "@core/api-contract/openapi";

export type OrgUnit = components["schemas"]["OrgUnit"];
export type OrgUnitListResponse = components["schemas"]["OrgUnitListResponse"];
export type OrgUnitCreateRequest = components["schemas"]["OrgUnitCreateRequest"];
export type OrgUnitUpdateRequest = components["schemas"]["OrgUnitUpdateRequest"];

export type OrgsListParams = operations["listOrgUnits"]["parameters"]["query"];

/** Wrapper for PATCH — keeps orgId alongside the patch body */
export interface OrgUnitUpdateRequestBody {
  orgId: string;
  data: OrgUnitUpdateRequest;
}
