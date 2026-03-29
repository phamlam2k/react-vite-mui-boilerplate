/**
 * 🟢 USE CASE LAYER - Orchestration
 * Depends only on ILeavePort (injected). Optional ICurrentUserPort for authz.
 */

import type { ILeavePort } from "./leave.port";
import type { ICurrentUserPort } from "@shared/ports/current-user.port";
import { ForbiddenError, NotFoundError } from "@shared/errors/app.errors";
import type {
  LeaveBalance,
  LeavePolicy,
  LeaveRequest,
  LeaveRequestFilters,
  LeaveRequestList,
} from "@modules/leave/_domain/leave.model";
import {
  canApproveLeave,
  canCancelLeaveRequest,
  canSubmitLeave,
  isAwaitingApproval,
} from "@modules/leave/_domain/leave.rules";
import {
  leaveRequestFiltersSchema,
  createLeaveRequestSchema,
  leaveDecisionSchema,
  type CreateLeaveRequestSchema,
  type LeaveDecisionSchema,
} from "./leave.validations";
import {
  mapFiltersToApiParams,
  mapCreateFormToApi,
  mapDecisionFormToApi,
  mapLeaveRequestDtoToDomain,
  mapLeaveBalanceDtoToDomain,
  mapLeavePolicyDtoToDomain,
} from "./leave.mappers";

export class LeaveUseCases {
  private readonly api: ILeavePort;
  private readonly currentUser: ICurrentUserPort | null;

  constructor(api: ILeavePort, currentUser: ICurrentUserPort | null = null) {
    this.api = api;
    this.currentUser = currentUser;
  }

  private getPermissions(): string[] {
    return this.currentUser?.getPermissions() ?? [];
  }

  private requirePermission(
    check: (perms: string[]) => boolean,
    msg: string
  ): void {
    if (this.currentUser && !check(this.getPermissions())) {
      throw new ForbiddenError(msg);
    }
  }

  async getRequestList(filters: LeaveRequestFilters): Promise<LeaveRequestList> {
    const validated = leaveRequestFiltersSchema.parse(filters);
    const params = mapFiltersToApiParams(validated);
    const response = await this.api.getRequestList(params);
    return {
      data: response.data.map(mapLeaveRequestDtoToDomain),
      meta: response.meta,
    };
  }

  async createRequest(formData: CreateLeaveRequestSchema): Promise<LeaveRequest> {
    this.requirePermission(canSubmitLeave, "Bạn không có quyền tạo yêu cầu nghỉ phép");
    const validated = createLeaveRequestSchema.parse(formData);
    const request = mapCreateFormToApi(validated);
    const response = await this.api.createRequest(request);
    return mapLeaveRequestDtoToDomain(response);
  }

  async getRequestById(requestId: string): Promise<LeaveRequest> {
    if (!requestId) throw new NotFoundError("Yêu cầu nghỉ phép không tồn tại");
    const response = await this.api.getRequestById(requestId);
    return mapLeaveRequestDtoToDomain(response);
  }

  async approveRequest(requestId: string, decision: LeaveDecisionSchema): Promise<LeaveRequest> {
    this.requirePermission(canApproveLeave, "Bạn không có quyền duyệt yêu cầu nghỉ phép");
    if (!requestId) throw new NotFoundError("Yêu cầu nghỉ phép không tồn tại");

    // Validate current status before calling API
    const current = await this.getRequestById(requestId);
    if (!isAwaitingApproval(current.status)) {
      throw new ForbiddenError("Yêu cầu này không ở trạng thái chờ duyệt");
    }

    const validated = leaveDecisionSchema.parse(decision);
    const response = await this.api.approveRequest(requestId, mapDecisionFormToApi(validated));
    return mapLeaveRequestDtoToDomain(response);
  }

  async rejectRequest(requestId: string, decision: LeaveDecisionSchema): Promise<LeaveRequest> {
    this.requirePermission(canApproveLeave, "Bạn không có quyền từ chối yêu cầu nghỉ phép");
    if (!requestId) throw new NotFoundError("Yêu cầu nghỉ phép không tồn tại");

    const current = await this.getRequestById(requestId);
    if (!isAwaitingApproval(current.status)) {
      throw new ForbiddenError("Yêu cầu này không ở trạng thái chờ duyệt");
    }

    const validated = leaveDecisionSchema.parse(decision);
    const response = await this.api.rejectRequest(requestId, mapDecisionFormToApi(validated));
    return mapLeaveRequestDtoToDomain(response);
  }

  async cancelRequest(requestId: string, currentUserId: string): Promise<LeaveRequest> {
    if (!requestId) throw new NotFoundError("Yêu cầu nghỉ phép không tồn tại");

    const current = await this.getRequestById(requestId);
    const isOwner = current.employeeId === currentUserId;

    if (!canCancelLeaveRequest(current.status, isOwner)) {
      throw new ForbiddenError(
        "Chỉ có thể hủy yêu cầu ở trạng thái nháp hoặc chờ duyệt"
      );
    }

    const response = await this.api.cancelRequest(requestId);
    return mapLeaveRequestDtoToDomain(response);
  }

  async getBalances(employeeId?: string): Promise<LeaveBalance[]> {
    const response = await this.api.getBalances({ employeeId });
    return response.data.map(mapLeaveBalanceDtoToDomain);
  }

  async getPolicies(): Promise<LeavePolicy[]> {
    const response = await this.api.getPolicies({ isActive: true });
    return response.data.map(mapLeavePolicyDtoToDomain);
  }
}
