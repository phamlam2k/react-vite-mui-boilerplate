/**
 * 🔵 DOMAIN LAYER - Business Rules
 * Business constants, invariants, validation rules
 */

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MIN_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export const MIN_SEARCH_LENGTH = 2;
export const SEARCH_DEBOUNCE_MS = 500;

/**
 * Employee status display names
 */
export const STATUS_LABELS = {
  probation: "Thử việc",
  active: "Đang làm việc",
  on_leave: "Nghỉ phép",
  terminated: "Đã nghỉ",
} as const;

/**
 * Work mode display names
 */
export const WORK_MODE_LABELS = {
  office: "Văn phòng",
  remote: "Làm từ xa",
  hybrid: "Kết hợp",
} as const;

/**
 * Gender display names
 */
export const GENDER_LABELS = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
  prefer_not_to_say: "Không tiết lộ",
} as const;

/**
 * Contract type display names
 */
export const CONTRACT_TYPE_LABELS = {
  probation: "Thử việc",
  fixed_term: "Có thời hạn",
  permanent: "Không thời hạn",
  part_time: "Bán thời gian",
  contractor: "Hợp đồng",
} as const;

/**
 * Pay schedule display names
 */
export const PAY_SCHEDULE_LABELS = {
  monthly: "Tháng",
  bi_weekly: "Hai tuần",
  weekly: "Tuần",
} as const;

/**
 * Permission codes for authz — from shared DEFAULT_PERMISSIONS seed
 */
import { PERMISSION_CODES } from "@shared/constants/permissions";

export const PERMISSION_EMPLOYEES_VIEW = PERMISSION_CODES.employees.view;
export const PERMISSION_EMPLOYEES_MANAGE = PERMISSION_CODES.employees.manage;

/** @deprecated Use PERMISSION_EMPLOYEES_MANAGE for create/update/delete */
export const PERMISSION_EMPLOYEE_CREATE = PERMISSION_CODES.employees.manage;
/** @deprecated Use PERMISSION_EMPLOYEES_MANAGE */
export const PERMISSION_EMPLOYEE_UPDATE = PERMISSION_CODES.employees.manage;
/** @deprecated Use PERMISSION_EMPLOYEES_MANAGE */
export const PERMISSION_EMPLOYEE_DELETE = PERMISSION_CODES.employees.manage;

/**
 * Validation rules
 */
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
