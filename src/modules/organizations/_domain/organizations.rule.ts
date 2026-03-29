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
export const ORG_NAME_MIN_LENGTH = 1;
export const ORG_NAME_MAX_LENGTH = 100;
export const ORG_CODE_MAX_LENGTH = 20;
export const ORG_DESCRIPTION_MAX_LENGTH = 500;

// --- Authorization policies ---
const ORG_VIEW = PERMISSION_CODES.organization.view;
const ORG_MANAGE = PERMISSION_CODES.organization.manage;

export function canViewOrg(permissions: string[]): boolean {
  return permissions.includes(ORG_VIEW) || permissions.includes(ORG_MANAGE);
}

export function canCreateOrg(permissions: string[]): boolean {
  return permissions.includes(ORG_MANAGE);
}

export function canEditOrg(permissions: string[]): boolean {
  return permissions.includes(ORG_MANAGE);
}

export function canDeleteOrg(permissions: string[]): boolean {
  return permissions.includes(ORG_MANAGE);
}
