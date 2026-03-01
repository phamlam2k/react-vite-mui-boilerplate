/**
 * 🟡 GATEWAY LAYER - HTTP Adapter (Class)
 * Implements IEmployeesPort; use cases depend on the port, not this class.
 */

import axiosInstance from "@core/axios";
import { generatePath } from "react-router";
import type { IEmployeesPort } from "@modules/employees/_usecases/employees.port";
import type {
  EmployeeCreateRequest,
  EmployeeListParams,
  EmployeeListResponse,
  EmployeeProfile,
  EmployeeUpdateRequestBody,
} from "./employees.type";

export const EmployeesApiRoutes = {
  Employees: "/employees",
  EmployeeById: "/employees/:employeeId",
} as const;

export class EmployeesApiGateway implements IEmployeesPort {
  async getEmployeesList(params: EmployeeListParams): Promise<EmployeeListResponse> {
    const response = await axiosInstance.get<EmployeeListResponse>(
      EmployeesApiRoutes.Employees,
      { params }
    );
    return response.data;
  }

  async createEmployee(data: EmployeeCreateRequest): Promise<EmployeeProfile> {
    const response = await axiosInstance.post<EmployeeProfile>(
      EmployeesApiRoutes.Employees,
      data
    );
    return response.data;
  }

  async getEmployeeById(employeeId: string): Promise<EmployeeProfile> {
    const response = await axiosInstance.get<EmployeeProfile>(
      generatePath(EmployeesApiRoutes.EmployeeById, { employeeId })
    );
    return response.data;
  }

  async updateEmployee(payload: EmployeeUpdateRequestBody): Promise<EmployeeProfile> {
    const response = await axiosInstance.patch<EmployeeProfile>(
      generatePath(EmployeesApiRoutes.EmployeeById, {
        employeeId: payload.employeeId,
      }),
      payload.data
    );
    return response.data;
  }

  async deleteEmployee(employeeId: string): Promise<void> {
    await axiosInstance.delete(
      generatePath(EmployeesApiRoutes.EmployeeById, { employeeId })
    );
  }
}

/** Singleton instance for app use; hooks can inject this into use cases. */
export const employeesApiGateway = new EmployeesApiGateway();
