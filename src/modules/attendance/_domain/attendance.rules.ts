/**
 * 🔵 DOMAIN LAYER - Business Rules
 *
 * Chỉ chứa:
 *  - Business invariants (validation constraints)
 *  - Status transition rules
 *  - Authorization policies
 *
 * KHÔNG chứa: pagination, debounce, display labels, i18n text.
 */

import { PERMISSION_CODES } from "@shared/constants/permissions";
import type { AttendanceStatus, CorrectionStatus } from "./attendance.model";

// --- Validation constraints ---
export const ATTENDANCE_NOTE_MAX_LENGTH = 500;
export const CORRECTION_REASON_MIN_LENGTH = 10;
export const CORRECTION_REASON_MAX_LENGTH = 500;
export const CORRECTION_REVIEW_NOTE_MAX_LENGTH = 500;

// --- Status transition rules ---

/** Can only check out if today has a check-in and no check-out yet */
export function canCheckOut(todayRecord: { checkInAt: string | null; checkOutAt: string | null } | null): boolean {
  return todayRecord !== null && todayRecord.checkInAt !== null && todayRecord.checkOutAt === null;
}

/** Can only check in if no active session today */
export function canCheckIn(todayRecord: { checkInAt: string | null } | null): boolean {
  return todayRecord === null || todayRecord.checkInAt === null;
}

/** A correction is actionable only when pending */
export function isCorrectionPending(status: CorrectionStatus): boolean {
  return status === "pending";
}

/** A record is "corrected" if its status explicitly says so */
export function isRecordCorrected(status: AttendanceStatus): boolean {
  return status === "corrected";
}

// --- Authorization policies ---
const { viewOwn, viewAll, approve } = PERMISSION_CODES.attendance;

export function canViewOwnAttendance(permissions: string[]): boolean {
  return permissions.includes(viewOwn) || permissions.includes(viewAll);
}

export function canViewAllAttendance(permissions: string[]): boolean {
  return permissions.includes(viewAll);
}

export function canApproveCorrection(permissions: string[]): boolean {
  return permissions.includes(approve);
}

export function canSubmitCorrection(permissions: string[]): boolean {
  return permissions.includes(viewOwn) || permissions.includes(viewAll);
}
