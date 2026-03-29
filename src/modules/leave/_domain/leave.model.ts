/**
 * 🔵 DOMAIN LAYER - Business Models
 * Pure business entities — no display labels, no framework dependencies
 */

import type { PaginatedResponse } from "@shared/types/pagination.type";

export type LeaveStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "cancelled";
export type LeaveHalfDayType = "morning" | "afternoon";
export type LeavePolicyType =
  | "annual"
  | "sick"
  | "unpaid"
  | "maternity"
  | "paternity"
  | "compensatory"
  | "other";
export type LeaveAccrualType = "upfront" | "monthly" | "daily";

export interface LeaveApprovalStep {
  approverId: string | null;
  approverName: string | null;
  decision: "pending" | "approved" | "rejected" | null;
  decidedAt: string | null;
  comment: string | null;
}

export interface LeaveRequest {
  id: string;
  tenantId: string;
  employeeId: string;
  employeeName: string;
  policyId: string;
  policyName: string;
  policyCode: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  halfDay: boolean;
  halfDayType: LeaveHalfDayType | null;
  reason: string | null;
  attachmentUrls: string[];
  status: LeaveStatus;
  approvalChain: LeaveApprovalStep[];
  createdAt: string;
  updatedAt: string;
}

export type LeaveRequestList = PaginatedResponse<LeaveRequest>;

export interface ILeaveRequestFilters {
  page?: number;
  pageSize?: number;
  employeeId?: string;
  status?: LeaveStatus | "all";
  policyCode?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface LeaveBalance {
  id: string;
  tenantId: string;
  employeeId: string;
  employeeName: string;
  policyId: string;
  policyName: string;
  policyCode: string;
  entitled: number;
  accrued: number;
  used: number;
  pending: number;
  remaining: number;
  year: number;
}

export interface LeavePolicy {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  type: LeavePolicyType;
  daysPerYear: number;
  accrualType: LeaveAccrualType;
  allowCarryOver: boolean;
  maxCarryOverDays: number | null;
  allowNegativeBalance: boolean;
  requireApproval: boolean;
  minAdvanceDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
