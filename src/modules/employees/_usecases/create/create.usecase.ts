/**
 * 🟢 USE CASE LAYER - Business Logic (Pure)
 * Orchestrates create employee logic WITHOUT framework dependencies
 */

import type { Employee } from "../../_domain/employees.model";
import { mapCreateEmployeeFormToApi } from "./create.mapper";
import {
  createEmployeeSchema,
  type CreateEmployeeSchema,
} from "./create.validation";
import { mapEmployeeProfileToEmployee } from "../list/list.mapper";
import type { IEmployeesPort } from "../employees.port";

export async function createEmployeeUseCase(
  api: IEmployeesPort["createEmployee"],
  formData: CreateEmployeeSchema
): Promise<Employee> {
  const validatedData = createEmployeeSchema.parse(formData);
  const apiRequest = mapCreateEmployeeFormToApi(validatedData);
  const response = await api(apiRequest);
  return mapEmployeeProfileToEmployee(response);
}
