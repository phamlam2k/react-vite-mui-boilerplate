/**
 * 🔵 DOMAIN LAYER - Business Rules
 *
 * Chỉ chứa:
 *  - Business invariants (validation constraints)
 *  - Security rules (password policy, username policy)
 *
 * KHÔNG chứa: pagination defaults, debounce, display labels, sort defaults.
 */

// --- Username validation constraints ---
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 20;
export const USERNAME_PATTERN = /^[a-z0-9_]+$/;

// --- Password policy (security invariants) ---
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 50;
export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

// --- Name validation constraints ---
export const FIRST_NAME_MAX_LENGTH = 50;
export const LAST_NAME_MAX_LENGTH = 50;
