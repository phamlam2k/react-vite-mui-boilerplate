import { createBrowserRouter } from "react-router";

import errorsRoutes from "@core/errors";

import { publicRoute } from "@routes/publicRoute";
import { wildcardRoute } from "@routes/wildcardRoute";
import { privateRoute } from "@routes/privateRoute";

export const AppRouter = createBrowserRouter([
  // Error pages
  ...errorsRoutes,

  // Public routes
  publicRoute,

  // Wildcard route
  wildcardRoute,

  // Private routes
  privateRoute,
]);
