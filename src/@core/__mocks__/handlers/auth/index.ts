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
  http.post("/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
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

  http.get("/auth/me", ({ request }) => {
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
