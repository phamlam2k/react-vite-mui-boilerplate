/**
 * 🟢 USE CASE LAYER - Port (Interface)
 * Defines what the use cases need from the outside. Gateway (outer) implements this.
 * Use cases depend only on this interface — dependency points INWARD.
 */

import type {
  PermissionListRequest,
  PermissionListResponse,
} from "@modules/roles_permissions/_api/permissions/permissions.type";

export interface IPermissionsPort {
  listPermissions(
    params?: PermissionListRequest
  ): Promise<PermissionListResponse>;
}
