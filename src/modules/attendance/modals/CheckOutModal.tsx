/**
 * 🟡 ADAPTER LAYER - Modal
 * Check-out confirmation with optional note.
 */

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import { checkOutSchema, type CheckOutSchema } from "@modules/attendance/_usecases/attendance.validations";
import { useCheckOutMutation } from "../hooks/useCheckOutMutation";

export type CheckOutModalProps = { onSuccess?: () => void };

const CheckOutModal = ({ type, payload }: ModalStack<CheckOutModalProps>) => {
  const { onSuccess } = payload ?? {};
  const { close } = useModalController();

  const { register, handleSubmit, formState: { errors } } = useForm<CheckOutSchema>({
    resolver: zodResolver(checkOutSchema) as never,
    defaultValues: { note: null },
  });

  const { mutate, isPending } = useCheckOutMutation();

  const onSubmit = (data: CheckOutSchema) => {
    mutate(data, {
      onSuccess: () => {
        onSuccess?.();
        close(type);
      },
    });
  };

  return (
    <Dialog open onClose={() => close(type)} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Check-out hôm nay</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <Typography variant="body2" color="text.secondary">
              Thời gian check-out:{" "}
              <strong>{new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</strong>
            </Typography>

            <TextField
              label="Ghi chú (tùy chọn)"
              size="small"
              fullWidth
              multiline
              rows={2}
              placeholder="Ví dụ: Ra ngoài gặp khách hàng..."
              {...register("note")}
              error={!!errors.note}
              helperText={errors.note?.message}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => close(type)} disabled={isPending}>Hủy</Button>
          <Button type="submit" variant="contained" color="warning" disabled={isPending}>
            {isPending ? "Đang check-out..." : "Check-out"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CheckOutModal;
