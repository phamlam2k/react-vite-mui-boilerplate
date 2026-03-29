/**
 * 🟢 USE CASE LAYER - Mappers
 * DTO ↔ Domain and Form → API transformations
 */

import type {
  EmployeeProfile,
  EmployeeListParams,
  EmployeeCreateRequest,
  ContractCreateRequest,
  EmployeeUpdateRequestBody,
} from "@modules/employees/_api/employees.type";
import type { Employee, EmployeesFilters } from "@modules/employees/_domain/employees.model";
import type { CreateEmployeeSchema, UpdateEmployeeSchema } from "./employees.validations";
import { pickBy } from "lodash-es";

export function mapFiltersToApiParams(filters: EmployeesFilters): EmployeeListParams {
  const params: EmployeeListParams = {
    page: filters.page,
    pageSize: filters.pageSize,
  };
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.orgUnitId?.trim()) params.orgUnitId = filters.orgUnitId.trim();
  if (filters.status && filters.status !== "all") params.status = filters.status;
  if (filters.workMode && filters.workMode !== "all") params.workMode = filters.workMode;
  if (filters.managerId?.trim()) params.managerId = filters.managerId.trim();
  return params;
}

export function mapEmployeeProfileToEmployee(profile: EmployeeProfile): Employee {
  return {
    ...profile,
    fullName: `${profile.firstName} ${profile.lastName}`.trim(),
  };
}

export function mapEmployeeProfilesToEmployees(profiles: EmployeeProfile[]): Employee[] {
  return profiles.map(mapEmployeeProfileToEmployee);
}

function mapContractToApi(contract: CreateEmployeeSchema["contract"]): ContractCreateRequest {
  return {
    type: contract.type,
    startDate: contract.startDate,
    endDate: contract.endDate ?? undefined,
    baseSalary: contract.baseSalary,
    currency: contract.currency,
    paySchedule: contract.paySchedule,
    payGrade: contract.payGrade ?? undefined,
  };
}

export function mapCreateEmployeeFormToApi(formData: CreateEmployeeSchema): EmployeeCreateRequest {
  return {
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: formData.email.trim(),
    phone: formData.phone?.trim() ?? undefined,
    gender: formData.gender,
    dateOfBirth: formData.dateOfBirth || undefined,
    nationalId: formData.nationalId?.trim() ?? undefined,
    taxId: formData.taxId?.trim() ?? undefined,
    orgUnitId: formData.orgUnitId,
    positionTitle: formData.positionTitle.trim(),
    managerId: formData.managerId ?? undefined,
    hireDate: formData.hireDate,
    workMode: formData.workMode,
    contract: mapContractToApi(formData.contract),
  };
}

export function mapUpdateEmployeeFormToApi(
  employeeId: string,
  formData: Partial<UpdateEmployeeSchema>
): EmployeeUpdateRequestBody {
  const data = pickBy(formData, (v): v is NonNullable<typeof v> => v !== undefined);
  return { employeeId, data };
}
