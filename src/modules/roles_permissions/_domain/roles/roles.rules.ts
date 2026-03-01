/**
 * 🔵 DOMAIN LAYER - Business Rules
 * Constants, invariants, and domain functions for Roles
 */

/** Pagination */
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MIN_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

/** Search */
export const MIN_SEARCH_LENGTH = 2;
export const SEARCH_DEBOUNCE_MS = 500;

/** Validation constraints */
export const ROLE_NAME_MIN_LENGTH = 2;
export const ROLE_NAME_MAX_LENGTH = 100;
export const ROLE_DESCRIPTION_MAX_LENGTH = 500;

import { PERMISSION_CODES } from "@shared/constants/permissions";

const ROLES_MANAGE = PERMISSION_CODES.roles.manage;
const ROLES_VIEW = PERMISSION_CODES.roles.view;

/**
 * System roles are protected — they cannot be deleted or renamed.
 */
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
