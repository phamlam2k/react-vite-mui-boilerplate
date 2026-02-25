/**
 * Mock API handlers for Employees (HRM)
 * Aligned with OpenAPI: /employees endpoints
 */

import type { components } from "@core/api-contract/openapi";
import { http, HttpResponse } from "msw";

type EmployeeProfile = components["schemas"]["EmployeeProfile"];
type EmployeeCreateRequest = components["schemas"]["EmployeeCreateRequest"];
type EmployeeUpdateRequest = components["schemas"]["EmployeeUpdateRequest"];

const mockEmployees: EmployeeProfile[] = [
  {
    id: "emp-1",
    tenantId: "tenant-1",
    userId: null,
    employeeCode: "EMP-0001",
    firstName: "Nguyễn",
    lastName: "Văn A",
    email: "nguyenvana@example.com",
    phone: "+84901234567",
    gender: "male",
    dateOfBirth: "1990-01-15",
    nationalId: null,
    taxId: null,
    orgUnitId: "org-1",
    orgUnitName: "Engineering",
    positionTitle: "Senior Software Engineer",
    managerId: null,
    managerName: null,
    status: "active",
    hireDate: "2022-03-01",
    terminationDate: null,
    workMode: "hybrid",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "emp-2",
    tenantId: "tenant-1",
    userId: null,
    employeeCode: "EMP-0002",
    firstName: "Trần",
    lastName: "Thị B",
    email: "tranthib@example.com",
    phone: null,
    gender: "female",
    dateOfBirth: "1992-05-20",
    nationalId: null,
    taxId: null,
    orgUnitId: "org-1",
    orgUnitName: "Engineering",
    positionTitle: "Developer",
    managerId: "emp-1",
    managerName: "Nguyễn Văn A",
    status: "active",
    hireDate: "2023-06-01",
    terminationDate: null,
    workMode: "office",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const employeesHandlers = [
  http.get("*/api/v1/employees", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20", 10);
    const search = url.searchParams.get("search");
    const orgUnitId = url.searchParams.get("orgUnitId");
    const status = url.searchParams.get("status");
    const workMode = url.searchParams.get("workMode");

    let filtered = [...mockEmployees];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.employeeCode.toLowerCase().includes(q)
      );
    }
    if (orgUnitId) filtered = filtered.filter((e) => e.orgUnitId === orgUnitId);
    if (status) filtered = filtered.filter((e) => e.status === status);
    if (workMode) filtered = filtered.filter((e) => e.workMode === workMode);

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return HttpResponse.json({
      data,
      meta: { page, pageSize, totalItems, totalPages },
    });
  }),

  http.post("*/api/v1/employees", async ({ request }) => {
    const body = (await request.json()) as EmployeeCreateRequest;

    if (!body.firstName?.trim() || !body.lastName?.trim() || !body.email?.trim()) {
      return HttpResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Missing required fields" } },
        { status: 400 }
      );
    }

    if (mockEmployees.some((e) => e.email === body.email.trim())) {
      return HttpResponse.json(
        { error: { code: "CONFLICT", message: "Email already exists" } },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const newId = `emp-${mockEmployees.length + 1}`;
    const newEmployee: EmployeeProfile = {
      id: newId,
      tenantId: "tenant-1",
      userId: null,
      employeeCode: `EMP-${String(mockEmployees.length + 1).padStart(4, "0")}`,
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim(),
      phone: body.phone ?? null,
      gender: body.gender ?? undefined,
      dateOfBirth: body.dateOfBirth ?? undefined,
      nationalId: body.nationalId ?? null,
      taxId: body.taxId ?? null,
      orgUnitId: body.orgUnitId,
      orgUnitName: "Engineering",
      positionTitle: body.positionTitle,
      managerId: body.managerId ?? null,
      managerName: null,
      status: "active",
      hireDate: body.hireDate,
      terminationDate: null,
      workMode: body.workMode,
      createdAt: now,
      updatedAt: now,
    };
    mockEmployees.push(newEmployee);

    return HttpResponse.json(newEmployee, { status: 201 });
  }),

  http.get("*/api/v1/employees/:employeeId", ({ params }) => {
    const employeeId = params.employeeId as string;
    const employee = mockEmployees.find((e) => e.id === employeeId);
    if (!employee) {
      return HttpResponse.json(
        { error: { code: "NOT_FOUND", message: "Employee not found" } },
        { status: 404 }
      );
    }
    return HttpResponse.json(employee);
  }),

  http.patch("*/api/v1/employees/:employeeId", async ({ request, params }) => {
    const employeeId = params.employeeId as string;
    const employee = mockEmployees.find((e) => e.id === employeeId);
    if (!employee) {
      return HttpResponse.json(
        { error: { code: "NOT_FOUND", message: "Employee not found" } },
        { status: 404 }
      );
    }

    const body = (await request.json()) as EmployeeUpdateRequest;
    const now = new Date().toISOString();

    if (body.firstName !== undefined) employee.firstName = body.firstName;
    if (body.lastName !== undefined) employee.lastName = body.lastName;
    if (body.phone !== undefined) employee.phone = body.phone;
    if (body.orgUnitId !== undefined) {
      employee.orgUnitId = body.orgUnitId;
      employee.orgUnitName = "Engineering";
    }
    if (body.positionTitle !== undefined)
      employee.positionTitle = body.positionTitle;
    if (body.managerId !== undefined) employee.managerId = body.managerId;
    if (body.status !== undefined) employee.status = body.status;
    if (body.workMode !== undefined) employee.workMode = body.workMode;
    if (body.terminationDate !== undefined)
      employee.terminationDate = body.terminationDate;
    employee.updatedAt = now;

    return HttpResponse.json(employee);
  }),

  http.delete("*/api/v1/employees/:employeeId", ({ params }) => {
    const employeeId = params.employeeId as string;
    const employee = mockEmployees.find((e) => e.id === employeeId);
    if (!employee) {
      return HttpResponse.json(
        { error: { code: "NOT_FOUND", message: "Employee not found" } },
        { status: 404 }
      );
    }
    employee.status = "terminated";
    employee.terminationDate = new Date().toISOString().slice(0, 10);
    employee.updatedAt = new Date().toISOString();
    return new HttpResponse(null, { status: 204 });
  }),
];
