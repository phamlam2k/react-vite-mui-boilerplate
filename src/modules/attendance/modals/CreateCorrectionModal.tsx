/**
 * 🟡 ADAPTER LAYER - Modal
 * Submit an attendance correction request.
 */

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import {
  createCorrectionSchema,
  type CreateCorrectionSchema,
} from "@modules/attendance/_usecases/attendance.validations";
import { useCreateCorrectionMutation } from "../hooks/useCreateCorrectionMutation";

export type CreateCorrectionModalProps = { onSuccess?: () => void };

const CreateCorrectionModal = ({ type, payload }: ModalStack<CreateCorrectionModalProps>) => {
  const { onSuccess } = payload ?? {};
  const { close } = useModalController();

  const { register, handleSubmit, formState: { errors } } = useForm<CreateCorrectionSchema>({
    resolver: zodResolver(createCorrectionSchema) as never,
    defaultValues: {
      attendanceRecordId: null,
      date: new Date().toISOString().slice(0, 10),
      checkInAt: "",
      checkOutAt: null,
      reason: "",
    },
  });

  const { mutate, isPending } = useCreateCorrectionMutation();

  const onSubmit = (data: CreateCorrectionSchema) => {
    mutate(data, {
      onSuccess: () => {
        onSuccess?.();
        close(type);
      },
    });
  };

  return (
    <Dialog open onClose={() => close(type)} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Yêu cầu điều chỉnh chấm công</DialogTitle>
        <DialogContent>
          <Box pt={1}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  label="Ngày cần điều chỉnh"
                  type="date"
                  size="small"
                  fullWidth
                  required
                  slotProps={{ inputLabel: { shrink: true } }}
                  {...register("date")}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Giờ vào (yêu cầu)"
                  type="datetime-local"
                  size="small"
                  fullWidth
                  required
                  slotProps={{ inputLabel: { shrink: true } }}
                  {...register("checkInAt")}
                  error={!!errors.checkInAt}
                  helperText={errors.checkInAt?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Giờ ra (yêu cầu, tùy chọn)"
                  type="datetime-local"
                  size="small"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  {...register("checkOutAt")}
                  error={!!errors.checkOutAt}
                  helperText={errors.checkOutAt?.message}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  label="Lý do điều chỉnh"
                  multiline
                  rows={3}
                  size="small"
                  fullWidth
                  required
                  placeholder="Mô tả rõ lý do bạn cần điều chỉnh dữ liệu chấm công..."
                  {...register("reason")}
                  error={!!errors.reason}
                  helperText={errors.reason?.message}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => close(type)} disabled={isPending}>Hủy</Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateCorrectionModal;
