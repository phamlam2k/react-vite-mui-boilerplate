import type { components, operations } from "@core/api-contract/openapi";

export type EmployeeProfile = components["schemas"]["EmployeeProfile"];
export type EmployeeCreateRequest =
  components["schemas"]["EmployeeCreateRequest"];
export type EmployeeUpdateRequest =
  components["schemas"]["EmployeeUpdateRequest"];
export type EmployeeListResponse =
  components["schemas"]["EmployeeListResponse"];
export type ContractCreateRequest =
  components["schemas"]["ContractCreateRequest"];

/**
 * Query parameters for employees list API
 */
export type EmployeeListParams =
  operations["listEmployees"]["parameters"]["query"];

export type EmployeeUpdateRequestBody = {
  employeeId: string;
  data: EmployeeUpdateRequest;
};
