import type { components, operations } from "@core/api-contract/openapi";

export type Role = components["schemas"]["Role"];
export type RoleListResponse = components["schemas"]["RoleListResponse"];
export type RoleCreateRequest = components["schemas"]["RoleCreateRequest"];
export type PermissionListResponse =
  components["schemas"]["PermissionListResponse"];
export type RolePermissionsUpdateRequest =
  components["schemas"]["RolePermissionsUpdateRequest"];

export type RoleListRequest = operations["listRoles"]["parameters"]["query"];

export type RoleUpdateRequest = {
  name?: string;
  description?: string | null;
};

export type RoleUpdateRequestBody = {
  roleId: string;
  data: RoleUpdateRequest;
};
