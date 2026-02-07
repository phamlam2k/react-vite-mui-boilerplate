import { http, HttpResponse } from "msw";
import { authHandlers } from "./handlers/auth/index.js";

export const handlers = [
  ...authHandlers,
  http.get("https://api.example.com/user", () => {
    return HttpResponse.json({
      firstName: "John",
      lastName: "Maverick",
    });
  }),
];
