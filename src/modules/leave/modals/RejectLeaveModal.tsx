/**
 * 🟡 ADAPTER LAYER - Modal
 * Reject a leave request with optional comment.
 */

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import {
  leaveDecisionSchema,
  type LeaveDecisionSchema,
} from "@modules/leave/_usecases/leave.validations";
import { useRejectLeave } from "../hooks/useLeaveActions";
import LeaveDecisionForm from "../components/LeaveDecisionForm";

export type RejectLeaveModalProps = {
  requestId: string;
  employeeName?: string;
  onSuccess?: () => void;
};

const RejectLeaveModal = ({ type, payload }: ModalStack<RejectLeaveModalProps>) => {
  const { requestId, employeeName, onSuccess } = payload ?? {};
  const { close } = useModalController();

  const methods = useForm<LeaveDecisionSchema>({
    resolver: zodResolver(leaveDecisionSchema) as never,
    defaultValues: { comment: null },
  });

  const { mutate, isPending } = useRejectLeave();

  const onSubmit = (data: LeaveDecisionSchema) => {
    mutate(
      { requestId: requestId!, decision: data },
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
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <DialogTitle>Từ chối yêu cầu nghỉ phép</DialogTitle>
          <DialogContent>
            {employeeName && (
              <Typography variant="body2" color="text.secondary" mb={1}>
                Nhân viên: <strong>{employeeName}</strong>
              </Typography>
            )}
            <LeaveDecisionForm label="Lý do từ chối (tùy chọn)" />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => close(type)} disabled={isPending}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="error" disabled={isPending}>
              {isPending ? "Đang xử lý..." : "Từ chối"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default RejectLeaveModal;
