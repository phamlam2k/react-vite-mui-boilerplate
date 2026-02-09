import { useMemo } from "react";
import type { MenuItemInterface } from "@shared/types/common.type";
import { privateRouteChildren } from "@routes/privateRoute";
import { extractMenuFromRoutes } from "../utils/extractMenuFromRoutes";

/**
 * Hook để lấy menu list từ route config
 * 
 * Menu được auto-generate từ routes có meta.showInMenu = true
 * Không cần hard-code menu nữa, chỉ cần config metadata trong route
 * 
 * @returns Menu items để hiển thị trong sidebar/drawer
 */
const useGetMenuList = (): MenuItemInterface[] => {
  const list = useMemo(() => {
    return extractMenuFromRoutes(privateRouteChildren);
  }, []);

  return list;
};

export default useGetMenuList;
