import type { RouteObject } from "react-router";

/**
 * Metadata cho route - dùng để generate menu, breadcrumbs, etc.
 */
export type RouteMetadata = {
  /**
   * Label hiển thị trong menu/breadcrumb
   */
  label?: string;

  /**
   * Icon hiển thị trong menu
   */
  icon?: React.ReactNode;

  /**
   * Có hiển thị trong menu không
   */
  showInMenu?: boolean;

  /**
   * Thứ tự sắp xếp trong menu (số nhỏ hơn lên trước)
   */
  order?: number;

  /**
   * Roles được phép truy cập (để sau này mở rộng RBAC)
   */
  roles?: string[];

  /**
   * Mô tả ngắn (dùng cho breadcrumb hoặc tooltip)
   */
  description?: string;
};

/**
 * Extended RouteObject với metadata
 */
export type RouteWithMeta = RouteObject & {
  meta?: RouteMetadata;
  children?: RouteWithMeta[];
};
