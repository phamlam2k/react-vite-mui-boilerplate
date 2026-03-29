/**
 * 🟡 ADAPTER LAYER - Modal
 * Confirm cancelling a leave request.
 */

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import { useAuthStore } from "@shared/stores/auth.store";
import { useCancelLeave } from "../hooks/useLeaveActions";

export type CancelLeaveModalProps = {
  requestId: string;
  onSuccess?: () => void;
};

const CancelLeaveModal = ({ type, payload }: ModalStack<CancelLeaveModalProps>) => {
  const { requestId, onSuccess } = payload ?? {};
  const { close } = useModalController();
  const currentUserId = useAuthStore((s) => s.user?.id ?? "");

  const { mutate, isPending } = useCancelLeave();

  const handleConfirm = () => {
    mutate(
      { requestId: requestId!, currentUserId },
      {
        onSuccess: () => {
          onSuccess?.();
          close(type);
        },
      }
    );
  };

  return (
    <Dialog open onClose={() => close(type)} maxWidth="xs" fullWidth>
      <DialogTitle>Hủy yêu cầu nghỉ phép</DialogTitle>
      <DialogContent>
        <Typography>Bạn có chắc chắn muốn hủy yêu cầu này không?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => close(type)} disabled={isPending}>
          Không
        </Button>
        <Button variant="contained" color="error" onClick={handleConfirm} disabled={isPending}>
          {isPending ? "Đang hủy..." : "Xác nhận hủy"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelLeaveModal;
