import type { MenuItemInterface } from "@shared/types/common.type";
import type { RouteWithMeta } from "@shared/types/route.type";

/**
 * Extract menu items từ route config
 * Chỉ lấy những route có meta.showInMenu = true
 */
export function extractMenuFromRoutes(
  routes: RouteWithMeta[]
): MenuItemInterface[] {
  const menuItems: MenuItemInterface[] = [];
  let idCounter = 1;

  function processRoute(route: RouteWithMeta): MenuItemInterface | null {
    const { meta, path, children } = route;

    // Skip nếu không có metadata hoặc không show trong menu
    if (!meta?.showInMenu || !path) {
      return null;
    }

    const menuItem: MenuItemInterface = {
      id: idCounter++,
      text: meta.label || path,
      path: path,
      icon: meta.icon,
    };

    // Xử lý children nếu có
    if (children && children.length > 0) {
      const childMenuItems = children
        .map(child => processRoute(child))
        .filter((item): item is MenuItemInterface => item !== null)
        .sort((a, b) => {
          // Sort theo order nếu có trong meta
          const routeA = children.find(r => r.path === a.path);
          const routeB = children.find(r => r.path === b.path);
          const orderA = (routeA as RouteWithMeta)?.meta?.order ?? 999;
          const orderB = (routeB as RouteWithMeta)?.meta?.order ?? 999;
          return orderA - orderB;
        });

      if (childMenuItems.length > 0) {
        menuItem.children = childMenuItems;
      }
    }

    return menuItem;
  }

  // Process tất cả routes
  routes.forEach(route => {
    const menuItem = processRoute(route);
    if (menuItem) {
      menuItems.push(menuItem);
    }
  });

  // Sort theo order
  return menuItems.sort((a, b) => {
    const routeA = routes.find(r => r.path === a.path);
    const routeB = routes.find(r => r.path === b.path);
    const orderA = routeA?.meta?.order ?? 999;
    const orderB = routeB?.meta?.order ?? 999;
    return orderA - orderB;
  });
}
