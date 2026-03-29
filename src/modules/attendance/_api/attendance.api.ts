import axiosInstance from "@core/axios";
import type { IAttendancePort } from "@modules/attendance/_usecases/attendance.port";
import type {
  AttendanceCorrectionDTO,
  AttendanceCorrectionListParams,
  AttendanceCorrectionListResponse,
  AttendanceCorrectionRequest,
  AttendanceCheckInRequest,
  AttendanceCheckOutRequest,
  AttendanceListResponse,
  AttendanceRecordDTO,
  AttendanceRecordListParams,
  CorrectionRejectRequest,
  CorrectionReviewRequest,
} from "./attendance.type";

const BASE = "/attendance";

export class AttendanceApiGateway implements IAttendancePort {
  async checkIn(body: AttendanceCheckInRequest): Promise<AttendanceRecordDTO> {
    const res = await axiosInstance.post(`${BASE}/check-in`, body);
    return res.data;
  }

  async checkOut(body: AttendanceCheckOutRequest): Promise<AttendanceRecordDTO> {
    const res = await axiosInstance.post(`${BASE}/check-out`, body);
    return res.data;
  }

  async getRecordList(params: AttendanceRecordListParams): Promise<AttendanceListResponse> {
    const res = await axiosInstance.get(`${BASE}/records`, { params });
    return res.data;
  }

  async getCorrectionList(params: AttendanceCorrectionListParams): Promise<AttendanceCorrectionListResponse> {
    const res = await axiosInstance.get(`${BASE}/corrections`, { params });
    return res.data;
  }

  async createCorrection(body: AttendanceCorrectionRequest): Promise<AttendanceCorrectionDTO> {
    const res = await axiosInstance.post(`${BASE}/corrections`, body);
    return res.data;
  }

  async approveCorrection(correctionId: string, body: CorrectionReviewRequest): Promise<AttendanceCorrectionDTO> {
    const res = await axiosInstance.post(`${BASE}/corrections/${correctionId}/approve`, body);
    return res.data;
  }

  async rejectCorrection(correctionId: string, body: CorrectionRejectRequest): Promise<AttendanceCorrectionDTO> {
    const res = await axiosInstance.post(`${BASE}/corrections/${correctionId}/reject`, body);
    return res.data;
  }
}

export const attendanceApiGateway = new AttendanceApiGateway();
