/**
 * 🟢 USE CASE LAYER - Orchestration
 * Depends only on IAttendancePort. Optional ICurrentUserPort for authz.
 */

import type { IAttendancePort } from "./attendance.port";
import type { ICurrentUserPort } from "@shared/ports/current-user.port";
import { ForbiddenError, NotFoundError } from "@shared/errors/app.errors";
import type {
  AttendanceCorrection,
  AttendanceCorrectionFilters,
  AttendanceCorrectionList,
  AttendanceRecord,
  AttendanceRecordFilters,
  AttendanceRecordList,
  CheckInPayload,
  CheckOutPayload,
} from "@modules/attendance/_domain/attendance.model";
import {
  canApproveCorrection,
  canSubmitCorrection,
  canViewOwnAttendance,
  isCorrectionPending,
} from "@modules/attendance/_domain/attendance.rules";
import {
  attendanceRecordFiltersSchema,
  attendanceCorrectionFiltersSchema,
  checkInSchema,
  checkOutSchema,
  createCorrectionSchema,
  correctionReviewSchema,
  correctionRejectSchema,
  type CheckInSchema,
  type CheckOutSchema,
  type CreateCorrectionSchema,
  type CorrectionReviewSchema,
  type CorrectionRejectSchema,
} from "./attendance.validations";
import {
  mapAttendanceRecordDtoToDomain,
  mapAttendanceCorrectionDtoToDomain,
  mapRecordFiltersToApiParams,
  mapCorrectionFiltersToApiParams,
  mapCheckInFormToApi,
  mapCheckOutFormToApi,
  mapCreateCorrectionFormToApi,
  mapCorrectionReviewFormToApi,
  mapCorrectionRejectFormToApi,
} from "./attendance.mappers";

export class AttendanceUseCases {
  private readonly api: IAttendancePort;
  private readonly currentUser: ICurrentUserPort | null;

  constructor(api: IAttendancePort, currentUser: ICurrentUserPort | null = null) {
    this.api = api;
    this.currentUser = currentUser;
  }

  private getPermissions(): string[] {
    return this.currentUser?.getPermissions() ?? [];
  }

  private requirePermission(check: (perms: string[]) => boolean, msg: string): void {
    if (this.currentUser && !check(this.getPermissions())) {
      throw new ForbiddenError(msg);
    }
  }

  // --- Check-in / Check-out ---

  async checkIn(formData: CheckInSchema): Promise<AttendanceRecord> {
    this.requirePermission(canViewOwnAttendance, "Bạn không có quyền chấm công");
    const validated = checkInSchema.parse(formData);
    const response = await this.api.checkIn(mapCheckInFormToApi(validated));
    return mapAttendanceRecordDtoToDomain(response);
  }

  async checkOut(formData: CheckOutSchema): Promise<AttendanceRecord> {
    this.requirePermission(canViewOwnAttendance, "Bạn không có quyền chấm công");
    const validated = checkOutSchema.parse(formData);
    const response = await this.api.checkOut(mapCheckOutFormToApi(validated));
    return mapAttendanceRecordDtoToDomain(response);
  }

  // --- Attendance Records ---

  async getRecordList(filters: AttendanceRecordFilters): Promise<AttendanceRecordList> {
    const validated = attendanceRecordFiltersSchema.parse(filters);
    const params = mapRecordFiltersToApiParams(validated);
    const response = await this.api.getRecordList(params);
    return {
      data: response.data.map(mapAttendanceRecordDtoToDomain),
      meta: response.meta,
    };
  }

  // --- Corrections ---

  async getCorrectionList(filters: AttendanceCorrectionFilters): Promise<AttendanceCorrectionList> {
    const validated = attendanceCorrectionFiltersSchema.parse(filters);
    const params = mapCorrectionFiltersToApiParams(validated);
    const response = await this.api.getCorrectionList(params);
    return {
      data: response.data.map(mapAttendanceCorrectionDtoToDomain),
      meta: response.meta,
    };
  }

  async createCorrection(formData: CreateCorrectionSchema): Promise<AttendanceCorrection> {
    this.requirePermission(canSubmitCorrection, "Bạn không có quyền tạo yêu cầu điều chỉnh chấm công");
    const validated = createCorrectionSchema.parse(formData);
    const response = await this.api.createCorrection(mapCreateCorrectionFormToApi(validated));
    return mapAttendanceCorrectionDtoToDomain(response);
  }

  async approveCorrection(correctionId: string, review: CorrectionReviewSchema): Promise<AttendanceCorrection> {
    this.requirePermission(canApproveCorrection, "Bạn không có quyền duyệt yêu cầu điều chỉnh chấm công");
    if (!correctionId) throw new NotFoundError("Yêu cầu điều chỉnh không tồn tại");

    const validated = correctionReviewSchema.parse(review);
    const response = await this.api.approveCorrection(correctionId, mapCorrectionReviewFormToApi(validated));
    return mapAttendanceCorrectionDtoToDomain(response);
  }

  async rejectCorrection(correctionId: string, rejection: CorrectionRejectSchema): Promise<AttendanceCorrection> {
    this.requirePermission(canApproveCorrection, "Bạn không có quyền từ chối yêu cầu điều chỉnh chấm công");
    if (!correctionId) throw new NotFoundError("Yêu cầu điều chỉnh không tồn tại");

    const validated = correctionRejectSchema.parse(rejection);
    const response = await this.api.rejectCorrection(correctionId, mapCorrectionRejectFormToApi(validated));
    return mapAttendanceCorrectionDtoToDomain(response);
  }
}
