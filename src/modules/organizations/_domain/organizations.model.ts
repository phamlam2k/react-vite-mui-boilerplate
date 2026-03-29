/**
 * 🔵 DOMAIN LAYER - Business Models
 * Pure domain types — NO imports from _api or any outer layer
 */

import type { PaginatedResponse } from "@shared/types/pagination.type";

export type OrgUnitType = "company" | "business_unit" | "department" | "team";

export interface OrgUnitItem {
  id: string;
  tenantId: string;
  name: string;
  type: OrgUnitType;
  parentId: string | null;
  code: string | null;
  description: string | null;
  isActive: boolean;
  headEmployeeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type OrgUnitsList = PaginatedResponse<OrgUnitItem>;

export interface OrgsFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: OrgUnitType | "all";
  isActive?: boolean | "all";
}
