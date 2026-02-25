/**
 * 🟢 USE CASE LAYER - Data Mappers
 * Transform between domain models and DTOs
 */

import type {
  EmployeeProfile,
  EmployeeListParams,
} from "../../_api/employees.type";
import type { Employee, EmployeesFilters } from "../../_domain/employees.model";
import { STATUS_LABELS, WORK_MODE_LABELS } from "../../_domain/employees.rules";

export function mapFiltersToApiParams(
  filters: EmployeesFilters
): EmployeeListParams {
  const params: EmployeeListParams = {
    page: filters.page,
    pageSize: filters.pageSize,
  };

  if (filters.search && filters.search.trim()) {
    params.search = filters.search.trim();
  }

  if (filters.orgUnitId && filters.orgUnitId.trim()) {
    params.orgUnitId = filters.orgUnitId.trim();
  }

  if (filters.status && filters.status !== "all") {
    params.status = filters.status;
  }

  if (filters.workMode && filters.workMode !== "all") {
    params.workMode = filters.workMode;
  }

  if (filters.managerId && filters.managerId.trim()) {
    params.managerId = filters.managerId.trim();
  }

  return params;
}

export function mapEmployeeProfileToEmployee(
  profile: EmployeeProfile
): Employee {
  return {
    ...profile,
    fullName: `${profile.firstName} ${profile.lastName}`.trim(),
    displayStatus: STATUS_LABELS[profile.status] ?? profile.status,
    displayWorkMode: profile.workMode
      ? WORK_MODE_LABELS[profile.workMode]
      : "-",
  };
}

export function mapEmployeeProfilesToEmployees(
  profiles: EmployeeProfile[]
): Employee[] {
  return profiles.map(mapEmployeeProfileToEmployee);
}
