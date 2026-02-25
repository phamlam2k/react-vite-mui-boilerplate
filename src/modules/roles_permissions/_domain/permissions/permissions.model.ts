/**
 * 🔵 DOMAIN LAYER - Business Models
 * Pure domain types — NO imports from _api or any outer layer
 */

import type { PaginatedResponse } from "@shared/types/pagination.type";

export interface PermissionItem {
  id: string;
  key: string;
  group: string;
  description: string;
}

export type PermissionsList = PaginatedResponse<PermissionItem>;
