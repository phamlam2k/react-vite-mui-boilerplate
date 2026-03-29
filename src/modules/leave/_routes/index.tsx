import LeaveUrls from "./path";
import LeaveManagementPage from "../pages/LeaveManagementPage";
import type { RouteWithMeta } from "@shared/types/route.type";
import EventNoteIcon from "@mui/icons-material/EventNote";
import leaveModalRegistry from "../modals/leave.modal.registry";

export { leaveModalRegistry };

export const leaveRoute: RouteWithMeta = {
  path: LeaveUrls.ROOT,
  element: <LeaveManagementPage />,
  meta: {
    label: "Nghỉ phép",
    icon: <EventNoteIcon />,
    showInMenu: true,
    order: 5,
  },
};
