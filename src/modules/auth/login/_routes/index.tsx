import type { RouteObject } from "react-router";
import AuthUrls from "../../_routes/path";
import LoginPage from "../pages/LoginPage";

const loginRoute: RouteObject = {
  path: AuthUrls.LOGIN,
  element: <LoginPage />,
};

export default loginRoute;
