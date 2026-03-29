/**
 * 🟢 USE CASE LAYER - Mappers
 * DTO ↔ Domain and Form → API transformations.
 */

import type {
  AttendanceCorrectionDTO,
  AttendanceCorrectionListParams,
  AttendanceCorrectionRequest,
  AttendanceCheckInRequest,
  AttendanceCheckOutRequest,
  AttendanceRecordDTO,
  AttendanceRecordListParams,
  CorrectionRejectRequest,
  CorrectionReviewRequest,
} from "@modules/attendance/_api/attendance.type";
import type {
  AttendanceCorrection,
  AttendanceRecord,
  GpsCoordinate,
} from "@modules/attendance/_domain/attendance.model";
import type {
  AttendanceCorrectionFiltersSchema,
  AttendanceRecordFiltersSchema,
  CheckInSchema,
  CheckOutSchema,
  CreateCorrectionSchema,
  CorrectionRejectSchema,
  CorrectionReviewSchema,
} from "./attendance.validations";

// DTO → Domain

function mapGps(gps?: { lat?: number; lng?: number } | null): GpsCoordinate | null {
  if (!gps) return null;
  return { lat: gps.lat ?? null, lng: gps.lng ?? null };
}

export function mapAttendanceRecordDtoToDomain(dto: AttendanceRecordDTO): AttendanceRecord {
  return {
    id: dto.id,
    tenantId: dto.tenantId,
    employeeId: dto.employeeId,
    employeeName: dto.employeeName,
    date: dto.date,
    checkInAt: dto.checkInAt ?? null,
    checkOutAt: dto.checkOutAt ?? null,
    workMode: dto.workMode,
    checkInGps: mapGps(dto.checkInGps),
    checkOutGps: mapGps(dto.checkOutGps),
    workedMinutes: dto.workedMinutes ?? 0,
    lateMinutes: dto.lateMinutes ?? 0,
    overtimeMinutes: dto.overtimeMinutes ?? 0,
    status: dto.status,
    note: dto.note ?? null,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function mapAttendanceCorrectionDtoToDomain(dto: AttendanceCorrectionDTO): AttendanceCorrection {
  return {
    id: dto.id,
    tenantId: dto.tenantId,
    employeeId: dto.employeeId,
    employeeName: dto.employeeName,
    attendanceRecordId: dto.attendanceRecordId ?? null,
    date: dto.date,
    requestedCheckInAt: dto.requestedCheckInAt,
    requestedCheckOutAt: dto.requestedCheckOutAt ?? null,
    reason: dto.reason,
    status: dto.status,
    reviewedBy: dto.reviewedBy ?? null,
    reviewNote: dto.reviewNote ?? null,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

// Filters → API params (strip "all" values)

export function mapRecordFiltersToApiParams(
  filters: AttendanceRecordFiltersSchema
): AttendanceRecordListParams {
  const params: AttendanceRecordListParams = {
    dateFrom: filters.dateFrom,
    dateTo: filters.dateTo,
    page: filters.page,
    pageSize: filters.pageSize,
  };
  if (filters.employeeId) params.employeeId = filters.employeeId;
  if (filters.orgUnitId) params.orgUnitId = filters.orgUnitId;
  if (filters.status && filters.status !== "all") params.status = filters.status;
  return params;
}

export function mapCorrectionFiltersToApiParams(
  filters: AttendanceCorrectionFiltersSchema
): AttendanceCorrectionListParams {
  const params: AttendanceCorrectionListParams = {
    page: filters.page,
    pageSize: filters.pageSize,
  };
  if (filters.employeeId) params.employeeId = filters.employeeId;
  if (filters.status && filters.status !== "all") params.status = filters.status;
  if (filters.dateFrom) params.dateFrom = filters.dateFrom;
  if (filters.dateTo) params.dateTo = filters.dateTo;
  return params;
}

// Form → API DTO

export function mapCheckInFormToApi(form: CheckInSchema): AttendanceCheckInRequest {
  return {
    workMode: form.workMode,
    gps: form.gps ? { lat: form.gps.lat ?? undefined, lng: form.gps.lng ?? undefined } : null,
    deviceInfo: form.deviceInfo ?? null,
    note: form.note ?? null,
  };
}

export function mapCheckOutFormToApi(form: CheckOutSchema): AttendanceCheckOutRequest {
  return {
    gps: form.gps ? { lat: form.gps.lat ?? undefined, lng: form.gps.lng ?? undefined } : null,
    deviceInfo: form.deviceInfo ?? null,
    note: form.note ?? null,
  };
}

export function mapCreateCorrectionFormToApi(form: CreateCorrectionSchema): AttendanceCorrectionRequest {
  return {
    attendanceRecordId: form.attendanceRecordId ?? null,
    date: form.date,
    checkInAt: form.checkInAt,
    checkOutAt: form.checkOutAt ?? undefined,
    reason: form.reason,
  };
}

export function mapCorrectionReviewFormToApi(form: CorrectionReviewSchema): CorrectionReviewRequest {
  return { note: form.note ?? null };
}

export function mapCorrectionRejectFormToApi(form: CorrectionRejectSchema): CorrectionRejectRequest {
  return { reason: form.reason };
}
