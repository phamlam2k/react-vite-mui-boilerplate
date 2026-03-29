/**
 * 🔵 DOMAIN LAYER - Business Rules
 *
 * Chỉ chứa:
 *  - Business invariants (validation constraints)
 *  - Authorization permission codes
 *
 * KHÔNG chứa: pagination defaults, debounce, display labels, i18n text.
 */

import { PERMISSION_CODES } from "@shared/constants/permissions";

// --- Authorization ---
export const PERMISSION_EMPLOYEES_VIEW = PERMISSION_CODES.employees.view;
export const PERMISSION_EMPLOYEES_MANAGE = PERMISSION_CODES.employees.manage;

// --- Validation constraints (business invariants) ---
export const FIRST_NAME_MAX_LENGTH = 100;
export const LAST_NAME_MAX_LENGTH = 100;
export const EMAIL_MAX_LENGTH = 255;
export const PHONE_MAX_LENGTH = 20;
export const POSITION_TITLE_MAX_LENGTH = 200;
export const NATIONAL_ID_MAX_LENGTH = 50;
export const TAX_ID_MAX_LENGTH = 50;
export const CONTRACT_NUMBER_MAX_LENGTH = 50;
export const PAY_GRADE_MAX_LENGTH = 20;
export const CURRENCY_MAX_LENGTH = 10;
