/**
 * 🔵 DOMAIN LAYER - Business Rules
 *
 * Chỉ chứa:
 *  - Business invariants (validation constraints)
 *  - Status transition rules
 *  - Authorization policies
 *
 * KHÔNG chứa: pagination defaults, debounce, display labels, i18n text.
 */

import { PERMISSION_CODES } from "@shared/constants/permissions";
import type { LeaveStatus } from "./leave.model";

// --- Validation constraints (business invariants) ---
export const LEAVE_REASON_MAX_LENGTH = 500;
export const LEAVE_COMMENT_MAX_LENGTH = 500;

// --- Status transition rules ---

/** Employee can cancel a request only when it's still pending or in draft */
export function canCancelLeaveRequest(
  status: LeaveStatus,
  isOwner: boolean
): boolean {
  return isOwner && (status === "draft" || status === "submitted");
}

/** A request is actionable by an approver only when submitted */
export function isAwaitingApproval(status: LeaveStatus): boolean {
  return status === "submitted";
}

// --- Authorization policies ---
const { viewOwn, viewAll, approve } = PERMISSION_CODES.leave;

export function canViewOwnLeave(permissions: string[]): boolean {
  return permissions.includes(viewOwn) || permissions.includes(viewAll);
}

export function canViewAllLeave(permissions: string[]): boolean {
  return permissions.includes(viewAll);
}

export function canApproveLeave(permissions: string[]): boolean {
  return permissions.includes(approve);
}

export function canSubmitLeave(permissions: string[]): boolean {
  return permissions.includes(viewOwn) || permissions.includes(viewAll);
}
