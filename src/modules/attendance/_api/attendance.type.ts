import type { components } from "@core/api-contract/openapi";

// --- DTOs from OpenAPI contract ---
export type AttendanceRecordDTO = components["schemas"]["AttendanceRecord"];
export type AttendanceListResponse = components["schemas"]["AttendanceListResponse"];
export type AttendanceCorrectionDTO = components["schemas"]["AttendanceCorrection"];
export type AttendanceCorrectionListResponse = components["schemas"]["AttendanceCorrectionListResponse"];
export type AttendanceCheckInRequest = components["schemas"]["AttendanceCheckInRequest"];
export type AttendanceCheckOutRequest = components["schemas"]["AttendanceCheckOutRequest"];
export type AttendanceCorrectionRequest = components["schemas"]["AttendanceCorrectionRequest"];

// --- API params ---
export interface AttendanceRecordListParams {
  employeeId?: string;
  orgUnitId?: string;
  dateFrom: string;
  dateTo: string;
  status?: "present" | "absent" | "late" | "half_day" | "corrected";
  page?: number;
  pageSize?: number;
}

export interface AttendanceCorrectionListParams {
  employeeId?: string;
  status?: "pending" | "approved" | "rejected";
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface CorrectionReviewRequest {
  note?: string | null;
}

export interface CorrectionRejectRequest {
  reason: string;
}
