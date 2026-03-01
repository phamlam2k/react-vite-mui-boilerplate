/**
 * Canonical permission seed — single source of truth for permission codes.
 * Backend should seed DB from this; frontend uses codes for authz checks.
 */

export interface PermissionSeed {
  code: string;
  name: string;
  resource: string;
  action: string;
}

export const DEFAULT_PERMISSIONS: PermissionSeed[] = [
  // Attendance
  {
    code: "attendance.view.own",
    name: "View own attendance",
    resource: "attendance",
    action: "view_own",
  },
  {
    code: "attendance.view.all",
    name: "View all attendance",
    resource: "attendance",
    action: "view_all",
  },
  {
    code: "attendance.approve",
    name: "Approve attendance corrections",
    resource: "attendance",
    action: "approve",
  },
  // Timesheet
  {
    code: "timesheet.view.own",
    name: "View own timesheets",
    resource: "timesheet",
    action: "view_own",
  },
  {
    code: "timesheet.view.all",
    name: "View all timesheets",
    resource: "timesheet",
    action: "view_all",
  },
  {
    code: "timesheet.approve",
    name: "Approve timesheets",
    resource: "timesheet",
    action: "approve",
  },
  // Payroll
  {
    code: "payroll.view.own",
    name: "View own payslips",
    resource: "payroll",
    action: "view_own",
  },
  {
    code: "payroll.view.all",
    name: "View all payroll",
    resource: "payroll",
    action: "view_all",
  },
  {
    code: "payroll.calculate",
    name: "Calculate payroll",
    resource: "payroll",
    action: "calculate",
  },
  {
    code: "payroll.approve",
    name: "Approve payroll cycles",
    resource: "payroll",
    action: "approve",
  },
  // Leave
  {
    code: "leave.view.own",
    name: "View own leave",
    resource: "leave",
    action: "view_own",
  },
  {
    code: "leave.view.all",
    name: "View all leave",
    resource: "leave",
    action: "view_all",
  },
  {
    code: "leave.approve",
    name: "Approve leave requests",
    resource: "leave",
    action: "approve",
  },
  // Employees
  {
    code: "employees.view",
    name: "View employees",
    resource: "employees",
    action: "view",
  },
  {
    code: "employees.manage",
    name: "Create/edit/delete employees",
    resource: "employees",
    action: "manage",
  },
  // Organization
  {
    code: "organization.view",
    name: "View org units",
    resource: "organization",
    action: "view",
  },
  {
    code: "organization.manage",
    name: "Manage org units",
    resource: "organization",
    action: "manage",
  },
  // Roles (RBAC)
  { code: "roles.view", name: "View roles", resource: "roles", action: "view" },
  {
    code: "roles.manage",
    name: "Manage roles and permissions",
    resource: "roles",
    action: "manage",
  },
  // Users
  { code: "users.view", name: "View users", resource: "users", action: "view" },
  {
    code: "users.manage",
    name: "Create/edit/delete users",
    resource: "users",
    action: "manage",
  },
  // Projects
  {
    code: "projects.view",
    name: "View projects",
    resource: "projects",
    action: "view",
  },
  {
    code: "projects.manage",
    name: "Manage projects",
    resource: "projects",
    action: "manage",
  },
  // Reports
  {
    code: "reports.view",
    name: "View reports",
    resource: "reports",
    action: "view",
  },
  {
    code: "reports.run",
    name: "Run reports",
    resource: "reports",
    action: "run",
  },
];

/** Permission codes for use in use-case authz (import this instead of hardcoding). */
export const PERMISSION_CODES = {
  attendance: {
    viewOwn: "attendance.view.own",
    viewAll: "attendance.view.all",
    approve: "attendance.approve",
  },
  timesheet: {
    viewOwn: "timesheet.view.own",
    viewAll: "timesheet.view.all",
    approve: "timesheet.approve",
  },
  payroll: {
    viewOwn: "payroll.view.own",
    viewAll: "payroll.view.all",
    calculate: "payroll.calculate",
    approve: "payroll.approve",
  },
  leave: {
    viewOwn: "leave.view.own",
    viewAll: "leave.view.all",
    approve: "leave.approve",
  },
  employees: {
    view: "employees.view",
    manage: "employees.manage",
  },
  organization: {
    view: "organization.view",
    manage: "organization.manage",
  },
  roles: {
    view: "roles.view",
    manage: "roles.manage",
  },
  users: {
    view: "users.view",
    manage: "users.manage",
  },
  projects: {
    view: "projects.view",
    manage: "projects.manage",
  },
  reports: {
    view: "reports.view",
    run: "reports.run",
  },
} as const;
