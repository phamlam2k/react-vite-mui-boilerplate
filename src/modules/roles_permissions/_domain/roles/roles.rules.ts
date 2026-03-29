/**
 * 🔵 DOMAIN LAYER - Business Rules
 *
 * Chỉ chứa:
 *  - Business invariants (validation constraints)
 *  - Domain policies (authorization functions)
 *
 * KHÔNG chứa: pagination defaults, debounce, display labels, i18n text.
 */

import { PERMISSION_CODES } from "@shared/constants/permissions";

// --- Validation constraints (business invariants) ---
export const ROLE_NAME_MIN_LENGTH = 2;
export const ROLE_NAME_MAX_LENGTH = 100;
export const ROLE_DESCRIPTION_MAX_LENGTH = 500;

// --- Authorization policies ---
const ROLES_MANAGE = PERMISSION_CODES.roles.manage;
const ROLES_VIEW = PERMISSION_CODES.roles.view;

/** System roles are protected — they cannot be deleted or renamed. */
export function canDeleteRole(permissions: string[]): boolean {
  return permissions.includes(ROLES_MANAGE);
}

export function canEditRole(permissions: string[]): boolean {
  return permissions.includes(ROLES_MANAGE);
}

export function canViewRole(permissions: string[]): boolean {
  return permissions.includes(ROLES_VIEW);
}

export function canCreateRole(permissions: string[]): boolean {
  return permissions.includes(ROLES_MANAGE);
}
