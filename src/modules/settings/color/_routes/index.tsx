import type { RouteWithMeta } from "@shared/types/route.type";
import SettingUrls from "../../_routes/path";
import { ColorSettingPageLazy } from "./lazy";

const colorSettingRoute: RouteWithMeta = {
  path: SettingUrls.COLOR,
  element: <ColorSettingPageLazy />,
  meta: {
    label: "Color Setting",
    showInMenu: true,
    order: 2,
  },
};

export default colorSettingRoute;
