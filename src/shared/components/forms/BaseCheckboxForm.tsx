import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type BaseCheckboxFormProps = {
  name: string;
  label?: string;
  required?: boolean;
  id?: number;
};

const BaseCheckboxForm = ({ name, label }: BaseCheckboxFormProps) => {
  const { control } = useFormContext();

  return (
    <FormControl fullWidth>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <div className="flex align-center">
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label={null}
              />
              <div className="text-sm text-primary self-center">{label}</div>
            </div>
            {error?.message && (
              <FormHelperText error>{error.message}</FormHelperText>
            )}
          </>
        )}
      />
    </FormControl>
  );
};

export default BaseCheckboxForm;
