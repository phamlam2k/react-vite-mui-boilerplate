/**
 * 🟢 USE CASE LAYER - Mappers
 * DTO ↔ Domain and Form → API transformations
 */

import type {
  LeaveBalanceDTO,
  LeaveDecisionRequest,
  LeavePolicyDTO,
  LeaveRequestCreateRequest,
  LeaveRequestDTO,
  LeaveRequestListParams,
} from "@modules/leave/_api/leave.type";
import type {
  LeaveApprovalStep,
  LeaveBalance,
  LeavePolicy,
  LeaveRequest,
  LeaveRequestFilters,
} from "@modules/leave/_domain/leave.model";
import type {
  CreateLeaveRequestSchema,
  LeaveDecisionSchema,
  LeaveRequestFiltersSchema,
} from "./leave.validations";

// DTO → Domain
export function mapLeaveRequestDtoToDomain(dto: LeaveRequestDTO): LeaveRequest {
  return {
    id: dto.id,
    tenantId: dto.tenantId,
    employeeId: dto.employeeId,
    employeeName: dto.employeeName,
    policyId: dto.policyId,
    policyName: dto.policyName,
    policyCode: dto.policyCode,
    startDate: dto.startDate,
    endDate: dto.endDate,
    totalDays: dto.totalDays,
    halfDay: dto.halfDay,
    halfDayType: dto.halfDayType ?? null,
    reason: dto.reason ?? null,
    attachmentUrls: dto.attachmentUrls ?? [],
    status: dto.status,
    approvalChain: dto.approvalChain.map(
      (step): LeaveApprovalStep => ({
        approverId: step.approverId ?? null,
        approverName: step.approverName ?? null,
        decision: step.decision ?? null,
        decidedAt: step.decidedAt ?? null,
        comment: step.comment ?? null,
      })
    ),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function mapLeaveBalanceDtoToDomain(dto: LeaveBalanceDTO): LeaveBalance {
  return { ...dto };
}

export function mapLeavePolicyDtoToDomain(dto: LeavePolicyDTO): LeavePolicy {
  return {
    ...dto,
    maxCarryOverDays: dto.maxCarryOverDays ?? null,
    minAdvanceDays: dto.minAdvanceDays ?? 0,
  };
}

// Filters → API params (strip "all" values)
export function mapFiltersToApiParams(filters: LeaveRequestFiltersSchema): LeaveRequestListParams {
  const params: LeaveRequestListParams = {
    page: filters.page,
    pageSize: filters.pageSize,
  };
  if (filters.employeeId) params.employeeId = filters.employeeId;
  if (filters.status && filters.status !== "all") params.status = filters.status;
  if (filters.policyCode) params.policyCode = filters.policyCode;
  if (filters.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters.dateTo) params.dateTo = filters.dateTo;
  return params;
}

// Form → API DTO
export function mapCreateFormToApi(form: CreateLeaveRequestSchema): LeaveRequestCreateRequest {
  return {
    policyId: form.policyId,
    startDate: form.startDate,
    endDate: form.endDate,
    halfDay: form.halfDay,
    halfDayType: form.halfDayType ?? null,
    reason: form.reason ?? null,
    attachmentUrls: form.attachmentUrls ?? [],
  };
}

export function mapDecisionFormToApi(form: LeaveDecisionSchema): LeaveDecisionRequest {
  return { comment: form.comment ?? null };
}

// Default filters
export function makeDefaultLeaveFilters(): LeaveRequestFilters {
  return { page: 1, pageSize: 20, status: "all" };
}
