/**
 * 🟡 ADAPTER LAYER - UI Component
 * Simple comment field for approve/reject decision modal.
 */

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormContext } from "react-hook-form";
import type { LeaveDecisionSchema } from "@modules/leave/_usecases/leave.validations";

interface Props {
  label?: string;
}

export default function LeaveDecisionForm({ label = "Ghi chú (tùy chọn)" }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<LeaveDecisionSchema>();

  return (
    <Box pt={1}>
      <TextField
        label={label}
        multiline
        rows={3}
        size="small"
        fullWidth
        placeholder="Thêm ghi chú..."
        {...register("comment")}
        error={!!errors.comment}
        helperText={errors.comment?.message}
      />
    </Box>
  );
}
