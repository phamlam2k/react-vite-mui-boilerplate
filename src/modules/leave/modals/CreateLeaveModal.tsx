/**
 * 🟡 ADAPTER LAYER - Modal
 * Create a new leave request.
 */

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import {
  createLeaveRequestSchema,
  type CreateLeaveRequestSchema,
} from "@modules/leave/_usecases/leave.validations";
import { useCreateLeaveMutation } from "../hooks/useCreateLeaveMutation";
import LeaveRequestForm from "../components/LeaveRequestForm";

export type CreateLeaveModalProps = { onSuccess?: () => void };

const CreateLeaveModal = ({ type, payload }: ModalStack<CreateLeaveModalProps>) => {
  const { onSuccess } = payload ?? {};
  const { close } = useModalController();

  const methods = useForm<CreateLeaveRequestSchema>({
    resolver: zodResolver(createLeaveRequestSchema) as never,
    defaultValues: {
      policyId: "",
      startDate: "",
      endDate: "",
      halfDay: false,
      halfDayType: null,
      reason: null,
      attachmentUrls: [],
    },
  });

  const { mutate, isPending } = useCreateLeaveMutation();

  const onSubmit = (data: CreateLeaveRequestSchema) => {
    mutate(data, {
      onSuccess: () => {
        onSuccess?.();
        close(type);
      },
    });
  };

  const handleClose = () => {
    if (!isPending) close(type);
  };

  return (
    <Dialog open onClose={handleClose} maxWidth="sm" fullWidth>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <DialogTitle>Tạo yêu cầu nghỉ phép</DialogTitle>
          <DialogContent>
            <LeaveRequestForm />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={isPending}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" disabled={isPending}>
              {isPending ? "Đang gửi..." : "Gửi yêu cầu"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default CreateLeaveModal;
