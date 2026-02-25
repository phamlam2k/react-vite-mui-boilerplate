/**
 * 🔵 DOMAIN LAYER - Business Models
 * Pure domain types — NO imports from _api or any outer layer
 */

import type { PaginatedResponse } from "@shared/types/pagination.type";
import type { PermissionItem } from "../permissions/permissions.model";

export interface RoleItem {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissionCount: number;
  permissions?: PermissionItem[];
  createdAt: string;
  updatedAt: string;
}

export type RolesList = PaginatedResponse<RoleItem>;

export interface RolesFilters {
  page?: number;
  pageSize?: number;
  search?: string;
}
