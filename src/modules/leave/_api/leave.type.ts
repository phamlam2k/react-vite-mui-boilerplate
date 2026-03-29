import type { components } from "@core/api-contract/openapi";

// --- DTOs from OpenAPI contract ---
export type LeaveRequestDTO = components["schemas"]["LeaveRequest"];
export type LeaveRequestListResponse = components["schemas"]["LeaveRequestListResponse"];
export type LeaveRequestCreateRequest = components["schemas"]["LeaveRequestCreateRequest"];
export type LeaveDecisionRequest = components["schemas"]["LeaveDecisionRequest"];
export type LeaveBalanceDTO = components["schemas"]["LeaveBalance"];
export type LeaveBalanceListResponse = components["schemas"]["LeaveBalanceListResponse"];
export type LeavePolicyDTO = components["schemas"]["LeavePolicy"];
export type LeavePolicyListResponse = components["schemas"]["LeavePolicyListResponse"];

// --- API params ---
export interface LeaveRequestListParams {
  page?: number;
  pageSize?: number;
  employeeId?: string;
  status?: "draft" | "submitted" | "approved" | "rejected" | "cancelled";
  policyCode?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface LeaveBalanceParams {
  employeeId?: string;
}

export interface LeavePolicyListParams {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
}
