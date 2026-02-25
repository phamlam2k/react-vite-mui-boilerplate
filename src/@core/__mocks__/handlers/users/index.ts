/**
 * Mock API handlers for Users
 * Aligned with @core/api-contract/openapi.ts
 *
 * Contract endpoints:
 * - GET    /users              listUsers
 * - POST   /users              createUser
 * - GET    /users/{userId}     getUserById
 * - DELETE /users/{userId}     deleteUserById
 * - PATCH  /users/{userId}     updateUserById
 * - GET    /users/{username}   getUserByName  (same path, param = username when not id)
 * - PUT    /users/{username}   updateUser    (same path)
 */

import type { components } from "@core/api-contract/openapi";
import { http, HttpResponse } from "msw";

/** UserProfile shape from OpenAPI components["schemas"]["UserProfile"] */
type MockUserProfile = components["schemas"]["UserProfile"];

/** User shape (partial) from OpenAPI components["schemas"]["User"] - for getUserByName / updateUser */
interface MockUserPartial {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

/** UserUpdateRequest from OpenAPI - for PATCH /users/{userId} */
interface MockUserUpdateRequest {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  role?: "user" | "admin";
  isActive?: boolean;
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MOCK_ID_REGEX = /^user-\d+$/;

function isUserIdParam(param: string): boolean {
  return UUID_REGEX.test(param) || MOCK_ID_REGEX.test(param);
}

/** Mutable mock store - in-memory for dev/test */
const mockUsers: MockUserProfile[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  firstName: "Nguyễn",
  lastName: `Văn ${String.fromCharCode(65 + (i % 26))}`,
  role: i % 5 === 0 ? ("admin" as const) : ("user" as const),
  isActive: i % 7 !== 0,
  lastLoginAt:
    i % 3 === 0
      ? new Date(
          Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString()
      : undefined,
  createdAt: new Date(
    Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
  ).toISOString(),
  updatedAt: new Date(
    Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
  ).toISOString(),
}));

export const usersHandlers = [
  /**
   * GET /users - listUsers
   * Query: page, pageSize, search, role, isActive (optional sortBy, sortOrder for app)
   */
  http.get("/api/v1/users", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20", 10);
    const search = url.searchParams.get("search");
    const role = url.searchParams.get("role") as "user" | "admin" | null;
    const isActiveParam = url.searchParams.get("isActive");
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";

    let filtered = [...mockUsers];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        u =>
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
      );
    }
    if (role) filtered = filtered.filter(u => u.role === role);
    if (isActiveParam !== null && isActiveParam !== "") {
      const isActive = isActiveParam === "true";
      filtered = filtered.filter(u => u.isActive === isActive);
    }

    filtered.sort((a, b) => {
      let aVal: string | undefined;
      let bVal: string | undefined;
      switch (sortBy) {
        case "username":
          aVal = a.username;
          bVal = b.username;
          break;
        case "email":
          aVal = a.email;
          bVal = b.email;
          break;
        case "lastLoginAt":
          aVal = a.lastLoginAt ?? "";
          bVal = b.lastLoginAt ?? "";
          break;
        default:
          aVal = a.createdAt;
          bVal = b.createdAt;
      }
      const cmp = aVal.localeCompare(bVal);
      return sortOrder === "asc" ? cmp : -cmp;
    });

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return HttpResponse.json({
      data,
      meta: { page, pageSize, totalItems, totalPages },
    });
  }),

  /**
   * POST /users - createUser
   * Body: UserCreateRequest
   */
  http.post("/api/v1/users", async ({ request }) => {
    const body = (await request.json()) as {
      username: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role?: "user" | "admin";
      isActive?: boolean;
    };

    if (!body.username?.trim() || !body.email?.trim() || !body.password) {
      return HttpResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (mockUsers.some(u => u.username === body.username)) {
      return HttpResponse.json(
        { message: "Username already exists" },
        { status: 409 }
      );
    }
    if (mockUsers.some(u => u.email === body.email)) {
      return HttpResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const newUser: MockUserProfile = {
      id: `user-${mockUsers.length + 1}`,
      username: body.username.trim(),
      email: body.email.trim().toLowerCase(),
      firstName: body.firstName?.trim() ?? "",
      lastName: body.lastName?.trim() ?? "",
      role: body.role ?? "user",
      isActive: body.isActive !== false,
      lastLoginAt: undefined,
      createdAt: now,
      updatedAt: now,
    };
    mockUsers.push(newUser);

    return HttpResponse.json(newUser, { status: 201 });
  }),

  /**
   * GET /users/:param - getUserById (when param is id) or getUserByName (when param is username)
   * - If param is UUID or "user-N" → return UserProfile (getUserById)
   * - Else → return User partial (getUserByName)
   */
  http.get("/api/v1/users/:param", ({ params }) => {
    const param = params.param as string;
    if (isUserIdParam(param)) {
      const user = mockUsers.find(u => u.id === param);
      if (!user) {
        return HttpResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      return HttpResponse.json(user);
    }

    const user = mockUsers.find(u => u.username === param);
    if (!user) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    }
    const partial: MockUserPartial = {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    return HttpResponse.json(partial);
  }),

  /**
   * DELETE /users/:userId - deleteUserById
   */
  http.delete("/api/v1/users/:userId", ({ params }) => {
    const userId = params.userId as string;
    const idx = mockUsers.findIndex(u => u.id === userId);
    if (idx === -1) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    }
    mockUsers.splice(idx, 1);

    return new HttpResponse(
      {
        ...mockUsers[idx],
      },
      { status: 204 }
    );
  }),

  /**
   * PATCH /users/:userId - updateUserById
   * Body: UserUpdateRequest (partial)
   */
  http.patch("/api/v1/users/:userId", async ({ request, params }) => {
    const userId = params.userId as string;
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = (await request.json()) as MockUserUpdateRequest;
    const now = new Date().toISOString();

    if (body.username !== undefined) user.username = body.username;
    if (body.email !== undefined) user.email = body.email;
    if (body.firstName !== undefined) user.firstName = body.firstName;
    if (body.lastName !== undefined) user.lastName = body.lastName;
    if (body.role !== undefined) user.role = body.role;
    if (body.isActive !== undefined) user.isActive = body.isActive;
    user.updatedAt = now;

    return HttpResponse.json(user);
  }),

  /**
   * PUT /users/:username - updateUser (by username)
   * Body: User (partial)
   * Contract: 200 with no content; we return 200 with updated user for convenience
   */
  http.put("/api/v1/users/:username", async ({ request, params }) => {
    const username = params.username as string;
    const user = mockUsers.find(u => u.username === username);
    if (!user) {
      return HttpResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = (await request.json()) as MockUserPartial;
    const now = new Date().toISOString();

    if (body.username !== undefined) user.username = body.username;
    if (body.firstName !== undefined) user.firstName = body.firstName;
    if (body.lastName !== undefined) user.lastName = body.lastName;
    if (body.email !== undefined) user.email = body.email;
    user.updatedAt = now;

    return HttpResponse.json(user);
  }),
];
