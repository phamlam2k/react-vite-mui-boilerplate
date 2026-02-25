/**
 * 🔵 DOMAIN LAYER - Business Rules
 * Permissions are a read-only catalog — minimal rules needed
 */

export const PERMISSION_GROUPS = [
  "Organization",
  "Employee",
  "Payroll",
  "Attendance",
  "Leave",
  "Project",
  "Recruitment",
  "Report",
] as const;

export type PermissionGroup = (typeof PERMISSION_GROUPS)[number];

/**
 * Parse a namespaced key like "payroll.view.all" into parts
 */
export function parsePermissionKey(key: string) {
  const [resource, action, scope] = key.split(".");
  return { resource, action, scope } as const;
}
