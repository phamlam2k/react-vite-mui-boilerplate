/**
 * 🟢 USE CASE LAYER - Orchestration (Class)
 * Depends only on IEmployeesPort (injected). No gateway import.
 */

import type { IEmployeesPort } from "@modules/employees/_usecases/employees.port";
import type { ICurrentUserPort } from "@shared/ports/current-user.port";
import type {
  Employee,
  EmployeesFilters,
  EmployeesList,
} from "@modules/employees/_domain/employees.model";
import { PERMISSION_EMPLOYEES_MANAGE } from "@modules/employees/_domain/employees.rules";
import {
  employeesFiltersSchema,
  createEmployeeSchema,
  type CreateEmployeeSchema,
  type UpdateEmployeeSchema,
} from "./employees.validations";
import {
  mapFiltersToApiParams,
  mapEmployeeProfilesToEmployees,
  mapEmployeeProfileToEmployee,
  mapCreateEmployeeFormToApi,
  mapUpdateEmployeeFormToApi,
} from "./employees.mappers";
import { pickBy } from "lodash-es";

export class EmployeesUseCases {
  private readonly api: IEmployeesPort;
  private readonly currentUser: ICurrentUserPort | null;

  constructor(api: IEmployeesPort, currentUser: ICurrentUserPort | null = null) {
    this.api = api;
    this.currentUser = currentUser;
  }

  private requirePermission(permission: string): void {
    if (!this.currentUser) return;
    const permissions = this.currentUser.getPermissions();
    if (!permissions.includes(permission)) {
      throw new Error("Forbidden: missing permission " + permission);
    }
  }

  async getList(filters: EmployeesFilters): Promise<EmployeesList> {
    const validated = employeesFiltersSchema.parse(filters);
    const params = mapFiltersToApiParams(validated);
    const response = await this.api.getEmployeesList(params);
    return {
      data: mapEmployeeProfilesToEmployees(response.data),
      meta: response.meta,
    };
  }

  async create(formData: CreateEmployeeSchema): Promise<Employee> {
    this.requirePermission(PERMISSION_EMPLOYEES_MANAGE);
    const validated = createEmployeeSchema.parse(formData);
    const request = mapCreateEmployeeFormToApi(validated);
    const response = await this.api.createEmployee(request);
    return mapEmployeeProfileToEmployee(response);
  }

  async getById(employeeId: string): Promise<Employee> {
    if (!employeeId) throw new Error("Nhân viên không tồn tại");
    const response = await this.api.getEmployeeById(employeeId);
    return mapEmployeeProfileToEmployee(response);
  }

  async update(
    employeeId: string,
    formData: Partial<UpdateEmployeeSchema>
  ): Promise<Employee> {
    this.requirePermission(PERMISSION_EMPLOYEES_MANAGE);
    const cleaned = pickBy(
      formData,
      (v): v is NonNullable<typeof v> => v !== undefined
    );
    const payload = mapUpdateEmployeeFormToApi(employeeId, cleaned);
    const response = await this.api.updateEmployee(payload);
    return mapEmployeeProfileToEmployee(response);
  }

  async delete(employeeId: string): Promise<void> {
    this.requirePermission(PERMISSION_EMPLOYEES_MANAGE);
    if (!employeeId) throw new Error("Nhân viên không tồn tại");
    await this.api.deleteEmployee(employeeId);
  }
}
