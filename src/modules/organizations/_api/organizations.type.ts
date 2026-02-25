import type { components, operations } from "@core/api-contract/openapi";

export type OrganizationsListParams =
  operations["listOrgUnits"]["parameters"]["query"];
export type OrganizationsListResponse =
  components["schemas"]["OrgUnitListResponse"];
