import type { ChangeEventHandler } from "react";
import { useState, useMemo, useId } from "react";

import type { TextFieldProps } from "@mui/material";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";

import { Controller, useFormContext } from "react-hook-form";

import { Visibility, VisibilityOff } from "@mui/icons-material";

type IBaseTextFieldFormProps = {
  name: string;
  label?: string;
  labelProps?: React.ComponentProps<typeof FormLabel>;

  callBackValidate?: (value: string) => boolean;
} & TextFieldProps;

/**
 *
 * @param name Định nghĩa name cho field khi sử dụng react-hook-form
 *
 * @param label Định nghĩa label cho field
 *
 * @param labelProps Định nghĩa các props cho label
 *
 * @returns
 */
const BaseTextFieldForm = (props: IBaseTextFieldFormProps) => {
  const {
    id,
    name,
    label,
    type = "text",
    labelProps,
    callBackValidate,
    required,
    ...textfieldProps
  } = props;
  const generateId = useId();

  const idTextField = id ?? generateId;

  const [isShowPassword, setIsShowPassword] = useState(false);
  const methods = useFormContext();

  const typeField = useMemo(() => {
    if (type === "password" && isShowPassword) {
      return "text";
    }

    return type;
  }, [isShowPassword, type]);

  const handleClickShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  return (
    <FormControl fullWidth>
      {label && (
        <FormLabel htmlFor={idTextField} {...labelProps}>
          {label} <span style={{ color: "red" }}>{required ? "*" : ""}</span>
        </FormLabel>
      )}
      <Controller
        name={name}
        control={methods.control}
        defaultValue=""
        render={({ field, fieldState: { error } }) => {
          const handleChangeValue: ChangeEventHandler<
            HTMLInputElement | HTMLTextAreaElement
          > = (e) => {
            const val = e.target.value;

            if (callBackValidate) {
              if (!callBackValidate(val)) return;

              field.onChange(val);

              return;
            }

            field.onChange(val);
          };

          return (
            <>
              <TextField
                {...field}
                {...textfieldProps}
                fullWidth
                id={idTextField}
                error={!!error}
                type={typeField}
                value={field.value ?? ""}
                onChange={handleChangeValue}
                aria-labelledby={idTextField}
                InputProps={{
                  endAdornment:
                    type === "password" ? (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          edge="end"
                          onClick={handleClickShowPassword}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          {isShowPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ) : (
                      textfieldProps?.InputProps?.endAdornment || null
                    ),
                  ...(textfieldProps?.InputProps || {}),
                }}
              />

              {error && error.message && (
                <FormHelperText error>{error.message}</FormHelperText>
              )}
            </>
          );
        }}
      />
    </FormControl>
  );
};

export default BaseTextFieldForm;
