// MUI Imports
import type { Theme } from "@mui/material/styles";

const input: Theme["components"] = {
  MuiFormControl: {
    styleOverrides: {
      root: {
        "&:has(.MuiRadio-root) .MuiFormHelperText-root, &:has(.MuiCheckbox-root) .MuiFormHelperText-root, &:has(.MuiSwitch-root) .MuiFormHelperText-root":
          {
            marginInline: 0,
          },
      },
    },
  },
  MuiInputBase: {
    defaultProps: {
      size: "small",
    },
    styleOverrides: {
      root: {
        fontWeight: 500,
        lineHeight: 1.6,
        "&.MuiInput-underline": {
          "&:before": {
            borderColor: "var(--mui-palette-customColors-inputBorder)",
          },
          "&:not(.Mui-disabled, .Mui-error):hover:before": {
            borderColor: "var(--mui-palette-action-active)",
          },
        },
        "&.Mui-disabled .MuiInputAdornment-root, &.Mui-disabled .MuiInputAdornment-root > *":
          {
            color: "var(--mui-palette-input-text)",
          },
      },
    },
  },
  MuiFilledInput: {
    styleOverrides: {
      root: {
        borderRadius: "var(--mui-shape-customBorderRadius-lg)",
        borderColor: "var(--mui-palette-FilledInput-border)",
        backgroundColor: "var(--mui-palette-FilledInput-bg)",

        "&:after": {
          display: "none",
        },
        "&:before": {
          display: "none",
        },
      },
      input: ({ theme, ownerState }) => ({
        ...(ownerState?.size === "medium" && {
          "&:not(.MuiInputBase-inputMultiline, .MuiInputBase-inputAdornedStart)":
            {
              color: "var(--mui-palette-input-text)",
              paddingBlock: theme.spacing(1.25),
            },
          height: "1.5em",
        }),
        "& ~ .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--mui-palette-input-border)",
        },
        "&:focus ~ .MuiOutlinedInput-notchedOutline": {
          /*
            TODO: Change border color to primary color
          */
          borderColor: "var(--mui-palette-input-border)",
        },
        "&.Mui-disabled": {
          "& ~ .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--mui-palette-input-border)",
            backgroundColor: "var(--mui-palette-input-disabledBackground)",
          },
        },
      }),
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      shrink: ({ ownerState }) => ({
        ...(ownerState.variant === "outlined" && {
          color: "var(--mui-palette-text-secondary)",
          transform: "translate(14px, -8px) scale(0.867)",
        }),
        ...(ownerState.variant === "filled" && {
          transform: "translate(12px, 7px) scale(0.867)",
        }),
        ...(ownerState.variant === "standard" && {
          transform: "translate(0, -1.5px) scale(0.867)",
        }),
      }),
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: "var(--mui-shape-customBorderRadius-lg)",
        backgroundColor: "var(--mui-palette-common-white)",
        "&:not(.Mui-focused):not(.Mui-error):not(.Mui-disabled):hover .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "var(--mui-palette-action-active)",
          },
        "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--mui-palette-action-disabledBackground)",
        },
      },
      inputAdornedStart: {
        paddingLeft: "0.75rem",
      },
      input: ({ ownerState }) => ({
        ...(ownerState?.size === "medium" && {
          "&:not(.MuiInputBase-inputMultiline, .MuiInputBase-inputAdornedStart)":
            {
              color: "var(--mui-palette-input-text)",
            },
          height: "var(--mui-shape-height-inputForm)",
        }),
        "& ~ .MuiOutlinedInput-notchedOutline": {
          borderColor: "var(--mui-palette-input-border)",
        },
        "&:focus ~ .MuiOutlinedInput-notchedOutline": {
          /*
            TODO: Change border color to primary color
          */
          borderColor: "var(--mui-palette-input-border)",
        },
        "&.Mui-disabled": {
          "& ~ .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--mui-palette-input-border)",
            backgroundColor: "var(--mui-palette-input-disabledBackground)",
          },
        },
      }),
      notchedOutline: {
        top: "-10px",
        "& legend": {
          fontSize: "0.867em",
        },
      },
    },
  },
  MuiInputAdornment: {
    styleOverrides: {
      root: {
        color: "var(--mui-palette-text-primary)",
        "& i, & svg": {
          fontSize: "1.25rem",
        },
        "& *": {
          color: "inherit !important",
        },
      },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        lineHeight: 1,
        letterSpacing: "unset",
      },
    },
  },
};

export default input;
