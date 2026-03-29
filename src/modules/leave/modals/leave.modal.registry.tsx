import CreateLeaveModal from "./CreateLeaveModal";
import ApproveLeaveModal from "./ApproveLeaveModal";
import RejectLeaveModal from "./RejectLeaveModal";
import CancelLeaveModal from "./CancelLeaveModal";

export const LeaveModalKeys = {
  CreateLeaveModal: "CreateLeaveModal",
  ApproveLeaveModal: "ApproveLeaveModal",
  RejectLeaveModal: "RejectLeaveModal",
  CancelLeaveModal: "CancelLeaveModal",
} as const;

const leaveModalRegistry = {
  [LeaveModalKeys.CreateLeaveModal]: CreateLeaveModal,
  [LeaveModalKeys.ApproveLeaveModal]: ApproveLeaveModal,
  [LeaveModalKeys.RejectLeaveModal]: RejectLeaveModal,
  [LeaveModalKeys.CancelLeaveModal]: CancelLeaveModal,
};

export default leaveModalRegistry;
