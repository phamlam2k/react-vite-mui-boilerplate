import SettingUrls from "../../_routes/path";
import type { RouteWithMeta } from "@shared/types/route.type";
import { AccountSettingPageLazy } from "./lazy";

const accountSettingRoute: RouteWithMeta = {
  path: SettingUrls.ACCOUNT,
  element: <AccountSettingPageLazy />,
  meta: {
    label: "Account Setting",
    showInMenu: true,
    order: 1,
  },
};

export default accountSettingRoute;
