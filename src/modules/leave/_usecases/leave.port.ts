/**
 * 🟢 USE CASE LAYER - Port (Interface)
 * Defines the contract that the use case depends on.
 * Implementation lives in _api/leave.api.ts.
 */

import type {
  LeaveBalanceListResponse,
  LeaveBalanceParams,
  LeaveDecisionRequest,
  LeavePolicyListParams,
  LeavePolicyListResponse,
  LeaveRequestCreateRequest,
  LeaveRequestDTO,
  LeaveRequestListParams,
  LeaveRequestListResponse,
} from "@modules/leave/_api/leave.type";

export interface ILeavePort {
  getRequestList(params: LeaveRequestListParams): Promise<LeaveRequestListResponse>;
  createRequest(body: LeaveRequestCreateRequest): Promise<LeaveRequestDTO>;
  getRequestById(requestId: string): Promise<LeaveRequestDTO>;
  approveRequest(requestId: string, body: LeaveDecisionRequest): Promise<LeaveRequestDTO>;
  rejectRequest(requestId: string, body: LeaveDecisionRequest): Promise<LeaveRequestDTO>;
  cancelRequest(requestId: string): Promise<LeaveRequestDTO>;
  getBalances(params: LeaveBalanceParams): Promise<LeaveBalanceListResponse>;
  getPolicies(params: LeavePolicyListParams): Promise<LeavePolicyListResponse>;
}
