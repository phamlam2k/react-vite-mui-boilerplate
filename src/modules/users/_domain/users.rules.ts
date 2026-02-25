/**
 * 🔵 DOMAIN LAYER - Business Rules
 * Business constants, invariants, validation rules
 */

/**
 * Pagination defaults
 */
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MIN_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

/**
 * Search constraints
 */
export const MIN_SEARCH_LENGTH = 2;
export const SEARCH_DEBOUNCE_MS = 500;

/**
 * Role display names
 */
export const ROLE_LABELS = {
  user: "Người dùng",
  admin: "Quản trị viên",
} as const;

/**
 * Status labels
 */
export const STATUS_LABELS = {
  true: "Hoạt động",
  false: "Bị khóa",
} as const;

/**
 * Default sort options
 */
export const DEFAULT_SORT_BY = "createdAt";
export const DEFAULT_SORT_ORDER = "desc";

/**
 * User validation rules
 */
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const USERNAME_PATTERN = /^[a-z0-9_]+$/;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 50;
export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export const FIRST_NAME_MAX_LENGTH = 50;
export const LAST_NAME_MAX_LENGTH = 50;
