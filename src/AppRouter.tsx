import { createBrowserRouter } from "react-router";

import {
  notFoundRoute,
  internalServerErrorRoute,
  unauthorizedRoute,
} from "@core/errors";

import { publicRoute } from "@routes/publicRoute";
import { wildcardRoute } from "@routes/wildcardRoute";
import { privateRoute } from "@routes/privateRoute";

export const AppRouter = createBrowserRouter([
  // Error pages
  internalServerErrorRoute,
  unauthorizedRoute,
  notFoundRoute,

  // Public routes
  publicRoute,

  // Wildcard route
  wildcardRoute,

  // Private routes
  privateRoute,
]);
