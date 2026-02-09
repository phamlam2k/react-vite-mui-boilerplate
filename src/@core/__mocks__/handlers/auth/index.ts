import type { AuthLoginRequest } from "@modules/auth/_api/auth.type";
import { http, HttpResponse } from "msw";

const fakeAccessToken = "fake-access-token";

const fakeUser = {
  id: "user-1",
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "user",
};

export const authHandlers = [
  http.post("/api/v1/auth/login", async ({ request }) => {
    const { usernameOrEmail, password } =
      (await request.json()) as AuthLoginRequest;

    if (!usernameOrEmail || !password) {
      return HttpResponse.json(
        { message: "Email hoặc mật khẩu không hợp lệ" },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      accessToken: fakeAccessToken,
      user: fakeUser,
    });
  }),

  http.get("/api/v1/auth/me", ({ request }) => {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token || token !== fakeAccessToken) {
      return HttpResponse.json(
        { message: "Không có accessToken hoặc accessToken không hợp lệ" },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      user: fakeUser,
      accessToken: fakeAccessToken,
    });
  }),
];
