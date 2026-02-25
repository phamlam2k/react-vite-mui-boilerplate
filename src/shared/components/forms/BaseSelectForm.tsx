import { useId } from "react";

import type { UseFormReturn } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";

import { FormControl, FormHelperText, FormLabel } from "@mui/material";

import type { BaseSelectProps } from "@shared/components/select/BaseSelect";
import BaseSelect from "@shared/components/select/BaseSelect";

interface BaseSelectFormProps<TValue> extends Omit<
  BaseSelectProps<TValue>,
  "value" | "onChange" | "variant"
> {
  name: string;
  label?: string;

  labelProps?: React.ComponentProps<typeof FormLabel>;

  callBackFn?: (value?: TValue | TValue[], methods?: UseFormReturn) => void;
}

/**
 *
 * @param name Tên của field trong form
 *
 * @param label Label của field
 *
 * @param labelProps Props của label
 *
 * @param callBackFn Hàm callback custom khi thay đổi giá trị
 *
 * @returns
 */
const BaseSelectForm = <TValue,>(props: BaseSelectFormProps<TValue>) => {
  const {
    id,
    name,
    label,
    labelProps,
    callBackFn,
    required,
    multiple,
    ...rest
  } = props;
  const generateId = useId();
  const methods = useFormContext();

  const idSelect = id ?? generateId;

  return (
    <FormControl fullWidth>
      {label && (
        <FormLabel htmlFor={idSelect} {...labelProps}>
          {label} <span style={{ color: "red" }}>{required ? "*" : ""}</span>
        </FormLabel>
      )}
      <Controller
        name={name}
        control={methods.control}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          function onChangeSelect(value: TValue | TValue[]) {
            onChange(value);
            callBackFn && callBackFn(value, methods);
          }

          return (
            <>
              <BaseSelect
                id={idSelect}
                aria-labelledby={idSelect}
                value={
                  multiple ? (Array.isArray(value) ? value : []) : value || ""
                }
                onChange={onChangeSelect}
                sx={
                  error && {
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "red",
                    },
                  }
                }
                multiple={multiple}
                {...rest}
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

export default BaseSelectForm;
