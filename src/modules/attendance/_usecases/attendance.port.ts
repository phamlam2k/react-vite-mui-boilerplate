/**
 * 🟢 USE CASE LAYER - Port (Interface)
 * Defines the contract that the use case depends on.
 * Implementation lives in _api/attendance.api.ts.
 */

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
} from "@modules/attendance/_api/attendance.type";

export interface IAttendancePort {
  checkIn(body: AttendanceCheckInRequest): Promise<AttendanceRecordDTO>;
  checkOut(body: AttendanceCheckOutRequest): Promise<AttendanceRecordDTO>;
  getRecordList(params: AttendanceRecordListParams): Promise<AttendanceListResponse>;
  getCorrectionList(params: AttendanceCorrectionListParams): Promise<AttendanceCorrectionListResponse>;
  createCorrection(body: AttendanceCorrectionRequest): Promise<AttendanceCorrectionDTO>;
  approveCorrection(correctionId: string, body: CorrectionReviewRequest): Promise<AttendanceCorrectionDTO>;
  rejectCorrection(correctionId: string, body: CorrectionRejectRequest): Promise<AttendanceCorrectionDTO>;
}
