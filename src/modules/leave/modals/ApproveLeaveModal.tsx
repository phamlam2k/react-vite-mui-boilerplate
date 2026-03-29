/**
 * 🟡 ADAPTER LAYER - Modal
 * Approve a leave request with optional comment.
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
import { useApproveLeave } from "../hooks/useLeaveActions";
import LeaveDecisionForm from "../components/LeaveDecisionForm";

export type ApproveLeaveModalProps = {
  requestId: string;
  employeeName?: string;
  onSuccess?: () => void;
};

const ApproveLeaveModal = ({ type, payload }: ModalStack<ApproveLeaveModalProps>) => {
  const { requestId, employeeName, onSuccess } = payload ?? {};
  const { close } = useModalController();

  const methods = useForm<LeaveDecisionSchema>({
    resolver: zodResolver(leaveDecisionSchema) as never,
    defaultValues: { comment: null },
  });

  const { mutate, isPending } = useApproveLeave();

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
          <DialogTitle>Duyệt yêu cầu nghỉ phép</DialogTitle>
          <DialogContent>
            {employeeName && (
              <Typography variant="body2" color="text.secondary" mb={1}>
                Nhân viên: <strong>{employeeName}</strong>
              </Typography>
            )}
            <LeaveDecisionForm label="Ghi chú duyệt (tùy chọn)" />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => close(type)} disabled={isPending}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="success" disabled={isPending}>
              {isPending ? "Đang duyệt..." : "Xác nhận duyệt"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ApproveLeaveModal;
