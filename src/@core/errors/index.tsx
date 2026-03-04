import UnauthorizedPage from "./401";
import NotFoundPage from "./404";
import InternalServerErrorPage from "./500";

const errorsRoutes = [
  {
    path: "/401",
    element: <UnauthorizedPage />,
  },
  {
    path: "/404",
    element: <NotFoundPage />,
  },
  {
    path: "/500",
    element: <InternalServerErrorPage />,
  },
];

export default errorsRoutes;
