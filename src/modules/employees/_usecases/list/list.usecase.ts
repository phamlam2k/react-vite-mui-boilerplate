/**
 * 🟢 USE CASE LAYER - Business Logic (Pure)
 * Orchestrates list employees logic WITHOUT framework dependencies
 */

import type {
  EmployeesFilters,
  EmployeesList,
} from "../../_domain/employees.model";
import type { IEmployeesPort } from "../employees.port";
import {
  mapFiltersToApiParams,
  mapEmployeeProfilesToEmployees,
} from "./list.mapper";
import { employeesFiltersSchema } from "./list.validation";

export async function getEmployeesListUseCase(
  api: IEmployeesPort["getEmployeesList"],
  filters: EmployeesFilters
): Promise<EmployeesList> {
  const validatedFilters = employeesFiltersSchema.parse(filters);
  const apiParams = mapFiltersToApiParams(validatedFilters);
  const response = await api(apiParams);
  const employees = mapEmployeeProfilesToEmployees(response.data);

  return {
    data: employees,
    meta: response.meta,
  };
}
