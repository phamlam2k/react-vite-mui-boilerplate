import authMiddleware from "./auth";
import type { MiddlewareFunction } from "react-router";
import logsMiddleware from "./logs";

export const middleware: MiddlewareFunction[] = [
  authMiddleware,
  logsMiddleware,
];
