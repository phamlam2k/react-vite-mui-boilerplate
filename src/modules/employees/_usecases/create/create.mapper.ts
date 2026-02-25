/**
 * 🟢 USE CASE LAYER - Data Mapper
 * Transform create employee form to API request
 */

import type {
  EmployeeCreateRequest,
  ContractCreateRequest,
} from "../../_api/employees.type";
import type { CreateEmployeeSchema } from "./create.validation";

function mapContractToApi(
  contract: CreateEmployeeSchema["contract"]
): ContractCreateRequest {
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

export function mapCreateEmployeeFormToApi(
  formData: CreateEmployeeSchema
): EmployeeCreateRequest {
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
