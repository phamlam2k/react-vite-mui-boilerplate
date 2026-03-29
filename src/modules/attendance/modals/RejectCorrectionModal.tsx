/**
 * 🟡 ADAPTER LAYER - Modal
 * Reject an attendance correction request with mandatory reason.
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
  correctionRejectSchema,
  type CorrectionRejectSchema,
} from "@modules/attendance/_usecases/attendance.validations";
import { useRejectCorrectionMutation } from "../hooks/useCorrectionActions";

export type RejectCorrectionModalProps = {
  correctionId: string;
  employeeName?: string;
  onSuccess?: () => void;
};

const RejectCorrectionModal = ({ type, payload }: ModalStack<RejectCorrectionModalProps>) => {
  const { correctionId, employeeName, onSuccess } = payload ?? {};
  const { close } = useModalController();

  const { register, handleSubmit, formState: { errors } } = useForm<CorrectionRejectSchema>({
    resolver: zodResolver(correctionRejectSchema) as never,
    defaultValues: { reason: "" },
  });

  const { mutate, isPending } = useRejectCorrectionMutation();

  const onSubmit = (data: CorrectionRejectSchema) => {
    mutate(
      { correctionId: correctionId!, rejection: data },
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
        <DialogTitle>Từ chối điều chỉnh chấm công</DialogTitle>
        <DialogContent>
          <Box pt={1} display="flex" flexDirection="column" gap={2}>
            {employeeName && (
              <Typography variant="body2" color="text.secondary">
                Nhân viên: <strong>{employeeName}</strong>
              </Typography>
            )}
            <TextField
              label="Lý do từ chối"
              size="small"
              fullWidth
              required
              multiline
              rows={2}
              placeholder="Nêu rõ lý do không duyệt yêu cầu này..."
              {...register("reason")}
              error={!!errors.reason}
              helperText={errors.reason?.message}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => close(type)} disabled={isPending}>Hủy</Button>
          <Button type="submit" variant="contained" color="error" disabled={isPending}>
            {isPending ? "Đang từ chối..." : "Từ chối"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RejectCorrectionModal;
