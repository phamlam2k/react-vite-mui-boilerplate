import type {
  EmployeeListParams,
  EmployeeListResponse,
  EmployeeProfile,
  EmployeeUpdateRequestBody,
  EmployeeCreateRequest,
} from "../_api/employees.type";

export interface IEmployeesPort {
  getEmployeesList(params: EmployeeListParams): Promise<EmployeeListResponse>;
  createEmployee(data: EmployeeCreateRequest): Promise<EmployeeProfile>;
  getEmployeeById(employeeId: string): Promise<EmployeeProfile>;
  updateEmployee(payload: EmployeeUpdateRequestBody): Promise<EmployeeProfile>;
  deleteEmployee(employeeId: string): Promise<void>;
}
