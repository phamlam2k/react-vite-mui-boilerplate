/**
 * 🟡 ADAPTER LAYER - Modal
 * Check-in with work mode selection.
 */

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import { checkInSchema, type CheckInSchema } from "@modules/attendance/_usecases/attendance.validations";
import { useCheckInMutation } from "../hooks/useCheckInMutation";

export type CheckInModalProps = { onSuccess?: () => void };

const CheckInModal = ({ type, payload }: ModalStack<CheckInModalProps>) => {
  const { onSuccess } = payload ?? {};
  const { close } = useModalController();

  const { register, handleSubmit, formState: { errors } } = useForm<CheckInSchema>({
    resolver: zodResolver(checkInSchema) as never,
    defaultValues: { workMode: "office", note: null },
  });

  const { mutate, isPending } = useCheckInMutation();

  const onSubmit = (data: CheckInSchema) => {
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
        <DialogTitle>Check-in hôm nay</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              select
              label="Chế độ làm việc"
              size="small"
              fullWidth
              required
              defaultValue="office"
              {...register("workMode")}
              error={!!errors.workMode}
              helperText={errors.workMode?.message}
            >
              <MenuItem value="office">Văn phòng</MenuItem>
              <MenuItem value="remote">Làm từ xa</MenuItem>
            </TextField>

            <TextField
              label="Ghi chú (tùy chọn)"
              size="small"
              fullWidth
              multiline
              rows={2}
              {...register("note")}
              error={!!errors.note}
              helperText={errors.note?.message}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => close(type)} disabled={isPending}>Hủy</Button>
          <Button type="submit" variant="contained" color="success" disabled={isPending}>
            {isPending ? "Đang check-in..." : "Check-in"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CheckInModal;
