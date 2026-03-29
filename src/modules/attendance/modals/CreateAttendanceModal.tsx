/**
 * 🟡 ADAPTER LAYER - Modal
 */

import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { AttendanceModalKeys } from "./attendance.modal.registry";

export type CreateAttendanceModalProps = { onSuccess?: () => void };

const CreateAttendanceModal = ({ type, payload }: ModalStack<CreateAttendanceModalProps>) => {
  const { close } = useModalController();
  const { onSuccess } = payload ?? {};

  const handleClose = () => {
    onSuccess?.();
    close();
  };

  return (
    <Dialog open onClose={handleClose}>
      <DialogTitle>Create Attendance</DialogTitle>
      <DialogContent>TODO: form</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleClose}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAttendanceModal;
