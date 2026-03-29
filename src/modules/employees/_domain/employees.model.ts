/**
 * 🔵 DOMAIN LAYER - Business Models
 * Pure business entities, no framework dependencies
 */

import type { PaginatedResponse } from "@shared/types/pagination.type";

export interface Employee {
  id: string;
  employeeCode: string;
  email: string;
  phone?: string | null;
  dateOfBirth?: string;
  orgUnitName: string;
  positionTitle: string;
  managerName?: string | null;
  hireDate: string;
  terminationDate?: string | null;
  createdAt: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender?: string | null;
  status: "probation" | "active" | "on_leave" | "terminated";
  workMode?: "office" | "remote" | "hybrid" | null;
}

export type EmployeesList = PaginatedResponse<Employee>;

export interface EmployeesFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  orgUnitId?: string;
  status?: "probation" | "active" | "on_leave" | "terminated" | "all";
  workMode?: "office" | "remote" | "hybrid" | "all";
  managerId?: string;
}
