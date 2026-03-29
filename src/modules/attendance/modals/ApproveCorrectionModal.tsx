/**
 * 🟡 ADAPTER LAYER - Modal
 * Approve an attendance correction request with optional note.
 */

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import {
  correctionReviewSchema,
  type CorrectionReviewSchema,
} from "@modules/attendance/_usecases/attendance.validations";
import { useApproveCorrectionMutation } from "../hooks/useCorrectionActions";

export type ApproveCorrectionModalProps = {
  correctionId: string;
  employeeName?: string;
  onSuccess?: () => void;
};

const ApproveCorrectionModal = ({ type, payload }: ModalStack<ApproveCorrectionModalProps>) => {
  const { correctionId, employeeName, onSuccess } = payload ?? {};
  const { close } = useModalController();

  const { register, handleSubmit, formState: { errors } } = useForm<CorrectionReviewSchema>({
    resolver: zodResolver(correctionReviewSchema) as never,
    defaultValues: { note: null },
  });

  const { mutate, isPending } = useApproveCorrectionMutation();

  const onSubmit = (data: CorrectionReviewSchema) => {
    mutate(
      { correctionId: correctionId!, review: data },
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Duyệt điều chỉnh chấm công</DialogTitle>
        <DialogContent>
          <Box pt={1} display="flex" flexDirection="column" gap={2}>
            {employeeName && (
              <Typography variant="body2" color="text.secondary">
                Nhân viên: <strong>{employeeName}</strong>
              </Typography>
            )}
            <TextField
              label="Ghi chú duyệt (tùy chọn)"
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
            {isPending ? "Đang duyệt..." : "Xác nhận duyệt"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ApproveCorrectionModal;
