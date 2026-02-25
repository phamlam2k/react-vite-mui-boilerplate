import type { components } from "@core/api-contract/openapi";

export type Permission = components["schemas"]["Permission"];
export type PermissionListResponse =
  components["schemas"]["PermissionListResponse"];

/** Query params for list permissions (catalog) */
export type PermissionListRequest = {
  group?: string;
};
