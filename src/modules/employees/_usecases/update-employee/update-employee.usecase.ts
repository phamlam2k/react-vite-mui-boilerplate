/**
 * 🟢 USE CASE LAYER - Business Logic (Pure)
 * Orchestrates update employee logic WITHOUT framework dependencies
 */

import type { Employee } from "../../_domain/employees.model";
import { mapUpdateEmployeeFormToApi } from "./update-employee.mapper";
import type { UpdateEmployeeSchema } from "./update-employee.validation";
import { mapEmployeeProfileToEmployee } from "../list/list.mapper";
import { pickBy } from "lodash-es";
import type { IEmployeesPort } from "../employees.port";

export async function updateEmployeeUseCase(
  api: IEmployeesPort["updateEmployee"],
  employeeId: string,
  formData: Partial<UpdateEmployeeSchema>
): Promise<Employee> {
  const _formData = pickBy(
    formData,
    (v): v is NonNullable<typeof v> => v !== undefined
  );
  const apiRequest = mapUpdateEmployeeFormToApi(employeeId, _formData);
  const response = await api(apiRequest);
  return mapEmployeeProfileToEmployee(response);
}
