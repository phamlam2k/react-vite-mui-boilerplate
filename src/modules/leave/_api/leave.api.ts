import axiosInstance from "@core/axios";
import type { ILeavePort } from "@modules/leave/_usecases/leave.port";
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
} from "./leave.type";

const BASE = "/leave";

export class LeaveApiGateway implements ILeavePort {
  async getRequestList(params: LeaveRequestListParams): Promise<LeaveRequestListResponse> {
    const res = await axiosInstance.get(`${BASE}/requests`, { params });
    return res.data;
  }

  async createRequest(body: LeaveRequestCreateRequest): Promise<LeaveRequestDTO> {
    const res = await axiosInstance.post(`${BASE}/requests`, body);
    return res.data;
  }

  async getRequestById(requestId: string): Promise<LeaveRequestDTO> {
    const res = await axiosInstance.get(`${BASE}/requests/${requestId}`);
    return res.data;
  }

  async approveRequest(requestId: string, body: LeaveDecisionRequest): Promise<LeaveRequestDTO> {
    const res = await axiosInstance.post(`${BASE}/requests/${requestId}/approve`, body);
    return res.data;
  }

  async rejectRequest(requestId: string, body: LeaveDecisionRequest): Promise<LeaveRequestDTO> {
    const res = await axiosInstance.post(`${BASE}/requests/${requestId}/reject`, body);
    return res.data;
  }

  async cancelRequest(requestId: string): Promise<LeaveRequestDTO> {
    const res = await axiosInstance.post(`${BASE}/requests/${requestId}/cancel`);
    return res.data;
  }

  async getBalances(params: LeaveBalanceParams): Promise<LeaveBalanceListResponse> {
    const res = await axiosInstance.get(`${BASE}/balances`, { params });
    return res.data;
  }

  async getPolicies(params: LeavePolicyListParams): Promise<LeavePolicyListResponse> {
    const res = await axiosInstance.get(`${BASE}/policies`, { params });
    return res.data;
  }
}

export const leaveApiGateway = new LeaveApiGateway();
