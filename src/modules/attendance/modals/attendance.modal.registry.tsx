import CheckInModal from "./CheckInModal";
import CheckOutModal from "./CheckOutModal";
import CreateCorrectionModal from "./CreateCorrectionModal";
import ApproveCorrectionModal from "./ApproveCorrectionModal";
import RejectCorrectionModal from "./RejectCorrectionModal";

export const AttendanceModalKeys = {
  CheckInModal: "CheckInModal",
  CheckOutModal: "CheckOutModal",
  CreateCorrectionModal: "CreateCorrectionModal",
  ApproveCorrectionModal: "ApproveCorrectionModal",
  RejectCorrectionModal: "RejectCorrectionModal",
} as const;

const attendanceModalRegistry = {
  [AttendanceModalKeys.CheckInModal]: CheckInModal,
  [AttendanceModalKeys.CheckOutModal]: CheckOutModal,
  [AttendanceModalKeys.CreateCorrectionModal]: CreateCorrectionModal,
  [AttendanceModalKeys.ApproveCorrectionModal]: ApproveCorrectionModal,
  [AttendanceModalKeys.RejectCorrectionModal]: RejectCorrectionModal,
};

export default attendanceModalRegistry;
