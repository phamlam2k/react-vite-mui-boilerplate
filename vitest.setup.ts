import { server } from "./src/@core/__mocks__/node.js";
import { beforeAll, afterEach, afterAll } from "vitest";

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
