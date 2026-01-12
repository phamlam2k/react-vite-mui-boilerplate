import AccountSettingPage from "../pages/AccountSettingPage";
import SettingUrls from "../../_routes/path";
import type { RouteObject } from "react-router";

const accountSettingRoute: RouteObject = {
  path: SettingUrls.ACCOUNT,
  element: <AccountSettingPage />,
};

export default accountSettingRoute;
