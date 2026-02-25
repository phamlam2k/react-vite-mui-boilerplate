/**
 * Mock API handlers for Permissions & Roles
 * Aligned with OpenAPI: /permissions, /roles, /roles/:roleId/permissions
 */

import type { components } from "@core/api-contract/openapi";
import { http, HttpResponse } from "msw";

type Permission = components["schemas"]["Permission"];
type Role = components["schemas"]["Role"];

const mockPermissions: Permission[] = [
  { id: "perm-1", key: "payroll.view.all", group: "Payroll", description: "View payroll records for all employees" },
  { id: "perm-2", key: "payroll.calculate", group: "Payroll", description: "Calculate payroll cycles" },
  { id: "perm-3", key: "leave.view.own", group: "Leave", description: "View own leave balance" },
  { id: "perm-4", key: "leave.request", group: "Leave", description: "Submit leave request" },
  { id: "perm-5", key: "employees.view", group: "Employees", description: "View employee list" },
];

const mockRoles: Role[] = [
  {
    id: "role-1",
    tenantId: "tenant-1",
    name: "Admin",
    description: "Full system access",
    isSystem: true,
    permissionCount: 5,
    permissions: mockPermissions,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "role-2",
    tenantId: "tenant-1",
    name: "Payroll Manager",
    description: "Can view and calculate payroll",
    isSystem: false,
    permissionCount: 2,
    permissions: mockPermissions.slice(0, 2),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const permissionsHandlers = [
  http.get("*/api/v1/permissions", ({ request }) => {
    const url = new URL(request.url);
    const group = url.searchParams.get("group");
    let data = mockPermissions;
    if (group) {
      data = data.filter((p) => p.group === group);
    }
    return HttpResponse.json({ data });
  }),

  http.get("*/api/v1/roles", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20", 10);
    const search = url.searchParams.get("search");

    let filtered = [...mockRoles];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description ?? "").toLowerCase().includes(q)
      );
    }

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return HttpResponse.json({
      data,
      meta: { page, pageSize, totalItems, totalPages },
    });
  }),

  http.post("*/api/v1/roles", async ({ request }) => {
    const body = (await request.json()) as { name: string; description?: string; permissionIds?: string[] };
    if (!body.name?.trim()) {
      return HttpResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Name required" } },
        { status: 400 }
      );
    }
    if (mockRoles.some((r) => r.name === body.name.trim())) {
      return HttpResponse.json(
        { error: { code: "CONFLICT", message: "Role name already exists" } },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const newId = `role-${mockRoles.length + 1}`;
    const permIds = body.permissionIds ?? [];
    const perms = mockPermissions.filter((p) => permIds.includes(p.id));

    const newRole: Role = {
      id: newId,
      tenantId: "tenant-1",
      name: body.name.trim(),
      description: body.description ?? null,
      isSystem: false,
      permissionCount: perms.length,
      permissions: perms,
      createdAt: now,
      updatedAt: now,
    };
    mockRoles.push(newRole);

    return HttpResponse.json(newRole, { status: 201 });
  }),

  http.get("*/api/v1/roles/:roleId", ({ params }) => {
    const roleId = params.roleId as string;
    const role = mockRoles.find((r) => r.id === roleId);
    if (!role) {
      return HttpResponse.json(
        { error: { code: "NOT_FOUND", message: "Role not found" } },
        { status: 404 }
      );
    }
    return HttpResponse.json(role);
  }),

  http.patch("*/api/v1/roles/:roleId", async ({ request, params }) => {
    const roleId = params.roleId as string;
    const role = mockRoles.find((r) => r.id === roleId);
    if (!role) {
      return HttpResponse.json(
        { error: { code: "NOT_FOUND", message: "Role not found" } },
        { status: 404 }
      );
    }
    const body = (await request.json()) as { name?: string; description?: string | null };
    if (body.name !== undefined) role.name = body.name;
    if (body.description !== undefined) role.description = body.description;
    role.updatedAt = new Date().toISOString();
    return HttpResponse.json(role);
  }),

  http.delete("*/api/v1/roles/:roleId", ({ params }) => {
    const roleId = params.roleId as string;
    const role = mockRoles.find((r) => r.id === roleId);
    if (!role) {
      return HttpResponse.json(
        { error: { code: "NOT_FOUND", message: "Role not found" } },
        { status: 404 }
      );
    }
    if (role.isSystem) {
      return HttpResponse.json(
        { error: { code: "BAD_REQUEST", message: "Cannot delete system role" } },
        { status: 400 }
      );
    }
    const idx = mockRoles.findIndex((r) => r.id === roleId);
    mockRoles.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("*/api/v1/roles/:roleId/permissions", ({ params }) => {
    const roleId = params.roleId as string;
    const role = mockRoles.find((r) => r.id === roleId);
    if (!role) {
      return HttpResponse.json(
        { error: { code: "NOT_FOUND", message: "Role not found" } },
        { status: 404 }
      );
    }
    return HttpResponse.json({ data: role.permissions ?? [] });
  }),

  http.put("*/api/v1/roles/:roleId/permissions", async ({ request, params }) => {
    const roleId = params.roleId as string;
    const role = mockRoles.find((r) => r.id === roleId);
    if (!role) {
      return HttpResponse.json(
        { error: { code: "NOT_FOUND", message: "Role not found" } },
        { status: 404 }
      );
    }
    const body = (await request.json()) as { permissionIds: string[] };
    const perms = mockPermissions.filter((p) => body.permissionIds.includes(p.id));
    role.permissions = perms;
    role.permissionCount = perms.length;
    role.updatedAt = new Date().toISOString();
    return HttpResponse.json({ data: perms });
  }),
];
