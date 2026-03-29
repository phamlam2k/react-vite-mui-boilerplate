import AttendanceUrls from "./path";
import AttendanceManagementPage from "../pages/AttendanceManagementPage";
import type { RouteWithMeta } from "@shared/types/route.type";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export const attendanceRoute: RouteWithMeta = {
  path: AttendanceUrls.ROOT,
  element: <AttendanceManagementPage />,
  meta: {
    label: "Chấm công",
    icon: <AccessTimeIcon />,
    showInMenu: true,
    order: 4,
  },
};
