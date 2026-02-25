/**
 * Mock API handlers for Organizations (Org Units)
 * Aligned with OpenAPI: GET /organizations (listOrgUnits)
 */

import type { components } from "@core/api-contract/openapi";
import { http, HttpResponse } from "msw";

type OrgUnit = components["schemas"]["OrgUnit"];

const mockOrgUnits: OrgUnit[] = [
  {
    id: "org-1",
    tenantId: "tenant-1",
    name: "Engineering",
    type: "department",
    parentId: null,
    code: "ENG",
    description: "Engineering department",
    isActive: true,
    headEmployeeId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "org-2",
    tenantId: "tenant-1",
    name: "Product",
    type: "department",
    parentId: null,
    code: "PD",
    description: "Product department",
    isActive: true,
    headEmployeeId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "org-3",
    tenantId: "tenant-1",
    name: "HR",
    type: "department",
    parentId: null,
    code: "HR",
    description: "Human Resources",
    isActive: true,
    headEmployeeId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const organizationsHandlers = [
  http.get("*/api/v1/organizations", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20", 10);
    const isActiveParam = url.searchParams.get("isActive");

    let filtered = [...mockOrgUnits];
    if (isActiveParam === "true") {
      filtered = filtered.filter((ou) => ou.isActive);
    } else if (isActiveParam === "false") {
      filtered = filtered.filter((ou) => !ou.isActive);
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
];
