/**
 * 🔵 DOMAIN LAYER - Business Models
 * Pure business entities — no display labels, no framework dependencies.
 */

import type { PaginatedResponse } from "@shared/types/pagination.type";

// --- Union types ---
export type AttendanceStatus = "present" | "absent" | "late" | "half_day" | "corrected";
export type AttendanceWorkMode = "office" | "remote";
export type CorrectionStatus = "pending" | "approved" | "rejected";

// --- Shared sub-types ---
export interface GpsCoordinate {
  lat: number | null;
  lng: number | null;
}

// --- AttendanceRecord ---
export interface AttendanceRecord {
  id: string;
  tenantId: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkInAt: string | null;
  checkOutAt: string | null;
  workMode: AttendanceWorkMode;
  checkInGps: GpsCoordinate | null;
  checkOutGps: GpsCoordinate | null;
  workedMinutes: number;
  lateMinutes: number;
  overtimeMinutes: number;
  status: AttendanceStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AttendanceRecordList = PaginatedResponse<AttendanceRecord>;

export interface AttendanceRecordFilters {
  page?: number;
  pageSize?: number;
  employeeId?: string;
  orgUnitId?: string;
  dateFrom: string;
  dateTo: string;
  status?: AttendanceStatus | "all";
}

// --- AttendanceCorrection ---
export interface AttendanceCorrection {
  id: string;
  tenantId: string;
  employeeId: string;
  employeeName: string;
  attendanceRecordId: string | null;
  date: string;
  requestedCheckInAt: string;
  requestedCheckOutAt: string | null;
  reason: string;
  status: CorrectionStatus;
  reviewedBy: string | null;
  reviewNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export type AttendanceCorrectionList = PaginatedResponse<AttendanceCorrection>;

export interface AttendanceCorrectionFilters {
  page?: number;
  pageSize?: number;
  employeeId?: string;
  status?: CorrectionStatus | "all";
  dateFrom?: string;
  dateTo?: string;
}

// --- Check-in/out actions ---
export interface CheckInPayload {
  workMode: AttendanceWorkMode;
  gps?: GpsCoordinate | null;
  deviceInfo?: string | null;
  note?: string | null;
}

export interface CheckOutPayload {
  gps?: GpsCoordinate | null;
  deviceInfo?: string | null;
  note?: string | null;
}
