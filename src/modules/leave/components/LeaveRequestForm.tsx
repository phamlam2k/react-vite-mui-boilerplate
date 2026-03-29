/**
 * 🟡 ADAPTER LAYER - UI Component
 * Form fields for creating a leave request — uses FormProvider from parent modal.
 */

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormContext, Controller } from "react-hook-form";
import type { CreateLeaveRequestSchema } from "@modules/leave/_usecases/leave.validations";
import { useLeavePolicies } from "../hooks/useLeavePolicies";

export default function LeaveRequestForm() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<CreateLeaveRequestSchema>();

  const { data: policies, isLoading: loadingPolicies } = useLeavePolicies();
  const isHalfDay = watch("halfDay");

  return (
    <Box display="flex" flexDirection="column" gap={2} pt={1}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField
            select
            label="Loại nghỉ phép"
            size="small"
            fullWidth
            required
            {...register("policyId")}
            error={!!errors.policyId}
            helperText={errors.policyId?.message}
            slotProps={{
              input: {
                endAdornment: loadingPolicies ? (
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                ) : null,
              },
            }}
          >
            {policies?.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Ngày bắt đầu"
            type="date"
            size="small"
            fullWidth
            required
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("startDate")}
            error={!!errors.startDate}
            helperText={errors.startDate?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Ngày kết thúc"
            type="date"
            size="small"
            fullWidth
            required
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("endDate")}
            error={!!errors.endDate}
            helperText={errors.endDate?.message}
          />
        </Grid>

        <Grid size={12}>
          <Controller
            name="halfDay"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} size="small" />}
                label="Nghỉ nửa ngày"
              />
            )}
          />
        </Grid>

        {isHalfDay && (
          <Grid size={12}>
            <TextField
              select
              label="Buổi nghỉ"
              size="small"
              fullWidth
              {...register("halfDayType")}
              error={!!errors.halfDayType}
            >
              <MenuItem value="morning">Buổi sáng</MenuItem>
              <MenuItem value="afternoon">Buổi chiều</MenuItem>
            </TextField>
            {errors.halfDayType && (
              <FormHelperText error>{String(errors.halfDayType.message)}</FormHelperText>
            )}
          </Grid>
        )}

        <Grid size={12}>
          <TextField
            label="Lý do nghỉ"
            multiline
            rows={3}
            size="small"
            fullWidth
            placeholder="Ghi rõ lý do nghỉ phép..."
            {...register("reason")}
            error={!!errors.reason}
            helperText={errors.reason?.message}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
