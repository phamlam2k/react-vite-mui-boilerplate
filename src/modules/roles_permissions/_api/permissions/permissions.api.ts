/**
 * 🟡 GATEWAY LAYER - HTTP Adapter (Class)
 * Implements IPermissionsPort.
 */

import axiosInstance from "@core/axios";
import type { IPermissionsPort } from "@modules/roles_permissions/_usecases/permissions/permissions.port";
import type {
  PermissionListRequest,
  PermissionListResponse,
} from "./permissions.type";

export const PermissionsApiRoutes = {
  Permissions: "/permissions",
} as const;

export class PermissionsApiGateway implements IPermissionsPort {
  async listPermissions(
    params?: PermissionListRequest
  ): Promise<PermissionListResponse> {
    const response = await axiosInstance.get<PermissionListResponse>(
      PermissionsApiRoutes.Permissions,
      { params }
    );
    return response.data;
  }
}

export const permissionsApiGateway = new PermissionsApiGateway();
