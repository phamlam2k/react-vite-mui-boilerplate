import type { components } from "@core/api-contract/openapi";
import { http, HttpResponse } from "msw";

export type AuthLoginRequest = components["schemas"]["AuthLoginRequest"];

const fakeAccessToken = "fake-access-token";

const fakeUser = {
  id: "user-1",
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "user",
  permissions: [
    { id: "p1", code: "employees.manage" },
    { id: "p2", code: "roles.manage" },
    { id: "p3", code: "roles.view" },
  ],
};

export const authHandlers = [
  // LOGIN
  http.post("/api/v1/auth/login", async ({ request }) => {
    const { usernameOrEmail, password } =
      (await request.json()) as AuthLoginRequest;

    if (!usernameOrEmail || !password) {
      return HttpResponse.json(
        { message: "Email hoặc mật khẩu không hợp lệ" },
        { status: 400 }
      );
    }

    // 🔥 Mock cookie set (dev only)
    document.cookie = `access_token=${fakeAccessToken}; path=/;`;

    return HttpResponse.json({
      user: fakeUser,
    });
  }),

  // GET CURRENT USER
  http.get("/api/v1/auth/me", async () => {
    // 🔥 Read cookie
    const token = document.cookie
      .split("; ")
      .find(row => row.startsWith("access_token="))
      ?.split("=")[1];

    if (!token || token !== fakeAccessToken) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return HttpResponse.json(fakeUser);
  }),

  // LOGOUT (optional but recommended)
  http.post("/api/v1/auth/logout", async () => {
    document.cookie = "access_token=; Max-Age=0; path=/";

    return HttpResponse.json({
      message: "Logout success",
    });
  }),
];
