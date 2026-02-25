import axiosInstance from "@core/axios";
import { generatePath } from "react-router";
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

const employeesApi = {
  getEmployeesList: async (params: EmployeeListParams) => {
    const response = await axiosInstance.get<EmployeeListResponse>(
      EmployeesApiRoutes.Employees,
      { params }
    );
    return response.data;
  },

  createEmployee: async (data: EmployeeCreateRequest) => {
    const response = await axiosInstance.post<EmployeeProfile>(
      EmployeesApiRoutes.Employees,
      data
    );
    return response.data;
  },

  getEmployeeById: async (employeeId: string) => {
    const response = await axiosInstance.get<EmployeeProfile>(
      generatePath(EmployeesApiRoutes.EmployeeById, { employeeId })
    );
    return response.data;
  },

  updateEmployee: async (payload: EmployeeUpdateRequestBody) => {
    const response = await axiosInstance.patch<EmployeeProfile>(
      generatePath(EmployeesApiRoutes.EmployeeById, {
        employeeId: payload.employeeId,
      }),
      payload.data
    );
    return response.data;
  },

  deleteEmployee: async (employeeId: string) => {
    await axiosInstance.delete(
      generatePath(EmployeesApiRoutes.EmployeeById, { employeeId })
    );
  },
};

export default employeesApi;
