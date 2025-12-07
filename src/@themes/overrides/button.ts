import type { Theme } from "@mui/material/styles";

const iconStyles = (size?: string) => ({
  "& > *:nth-of-type(1)": {
    ...(size === "small"
      ? {
          fontSize: "14px",
        }
      : {
          ...(size === "medium"
            ? {
                fontSize: "16px",
              }
            : {
                fontSize: "20px",
              }),
        }),
  },
});

const button: Theme["components"] = {
  MuiButton: {
    styleOverrides: {
      root: ({ theme, ownerState }) => ({
        ...(ownerState.variant === "text"
          ? {
              ...(ownerState.size === "small" && {
                padding:
                  ownerState.startIcon || ownerState.endIcon
                    ? theme.spacing(1.5, 2)
                    : theme.spacing(2, 2.5),
              }),
              ...(ownerState.size === "medium" && {
                padding:
                  ownerState.startIcon || ownerState.endIcon
                    ? theme.spacing(1.75, 2.5)
                    : theme.spacing(2, 3.5),
              }),
              ...(ownerState.size === "large" && {
                padding:
                  ownerState.startIcon || ownerState.endIcon
                    ? theme.spacing(2, 3)
                    : theme.spacing(2, 4.5),
              }),
            }
          : {
              ...(ownerState.variant === "outlined"
                ? {
                    ...(ownerState.size === "small" && {
                      padding:
                        ownerState.startIcon || ownerState.endIcon
                          ? theme.spacing(0.75, 2)
                          : theme.spacing(1, 3.5),
                    }),
                    ...(ownerState.size === "medium" && {
                      padding:
                        ownerState.startIcon || ownerState.endIcon
                          ? theme.spacing(1, 2.5)
                          : theme.spacing(1.25, 4.5),
                    }),
                    ...(ownerState.size === "large" && {
                      padding:
                        ownerState.startIcon || ownerState.endIcon
                          ? theme.spacing(1.25, 3)
                          : theme.spacing(2, 5.5),
                    }),
                  }
                : {
                    ...(ownerState.size === "small" && {
                      padding:
                        ownerState.startIcon || ownerState.endIcon
                          ? theme.spacing(0.75, 1.75)
                          : theme.spacing(1.5, 6),
                    }),
                    ...(ownerState.size === "medium" && {
                      padding:
                        ownerState.startIcon || ownerState.endIcon
                          ? theme.spacing(1.5, 2)
                          : theme.spacing(1.25, 4.5),
                    }),
                    ...(ownerState.size === "large" && {
                      padding:
                        ownerState.startIcon || ownerState.endIcon
                          ? theme.spacing(1.25, 3)
                          : theme.spacing(2, 5.5),
                    }),
                  }),
            }),
      }),
      contained: ({ theme, ownerState }) => ({
        boxShadow: "var(--mui-customShadows-xs)",
        ...(!ownerState.disabled && {
          "&:hover, &.Mui-focusVisible": {
            boxShadow: "var(--mui-customShadows-xs)",
          },
          "&:active": {
            boxShadow: "none",
          },
        }),
        backgroundColor: theme.palette.primary.main,
      }),
      sizeSmall: ({ theme }) => ({
        lineHeight: 1.38462,
        fontSize: theme.typography.body2.fontSize,
        borderRadius: "var(--mui-shape-customBorderRadius-xl)",
        height: theme.spacing(6),
      }),
      sizeMedium: ({ theme }) => ({
        lineHeight: 1.38462,
        borderRadius: "var(--mui-shape-customBorderRadius-xl)",
        height: theme.spacing(5),
        width: "auto",
      }),
      sizeLarge: {
        fontSize: "1.0625rem",
        lineHeight: 1.529412,
        borderRadius: "var(--mui-shape-customBorderRadius-lg)",
      },
      startIcon: ({ theme, ownerState }) => ({
        ...(ownerState.size === "small"
          ? {
              marginInlineEnd: theme.spacing(0.5),
            }
          : {
              ...(ownerState.size === "medium"
                ? {
                    marginInlineEnd: theme.spacing(1),
                  }
                : {
                    marginInlineEnd: theme.spacing(1.5),
                  }),
            }),
        ...iconStyles(ownerState.size),
      }),
      endIcon: ({ theme, ownerState }) => ({
        ...(ownerState.size === "small"
          ? {
              marginInlineStart: theme.spacing(1.5),
            }
          : {
              ...(ownerState.size === "medium"
                ? {
                    marginInlineStart: theme.spacing(2),
                  }
                : {
                    marginInlineStart: theme.spacing(2.5),
                  }),
            }),
        ...iconStyles(ownerState.size),
      }),
    },
    variants: [
      {
        props: { variant: "text", color: "primary" },
        style: {
          "&:not(.Mui-disabled):hover, &:not(.Mui-disabled):active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))":
            {
              backgroundColor: "var(--mui-palette-primary-lighterOpacity)",
            },
          "&.Mui-disabled": {
            opacity: 0.45,
            color: "var(--mui-palette-primary-main)",
          },
        },
      },
      {
        props: { variant: "text", color: "secondary" },
        style: {
          "&:not(.Mui-disabled):hover, &:not(.Mui-disabled):active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))":
            {
              backgroundColor: "var(--mui-palette-secondary-lighterOpacity)",
            },
          "&.Mui-disabled": {
            opacity: 0.45,
            color: "var(--mui-palette-secondary-main)",
          },
        },
      },
      {
        props: { variant: "text", color: "error" },
        style: {
          "&:not(.Mui-disabled):hover, &:not(.Mui-disabled):active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))":
            {
              backgroundColor: "var(--mui-palette-error-lighterOpacity)",
            },
          "&.Mui-disabled": {
            opacity: 0.45,
            color: "var(--mui-palette-error-main)",
          },
        },
      },
      {
        props: { variant: "text", color: "warning" },
        style: {
          "&:not(.Mui-disabled):hover, &:not(.Mui-disabled):active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))":
            {
              backgroundColor: "var(--mui-palette-warning-lighterOpacity)",
            },
          "&.Mui-disabled": {
            opacity: 0.45,
            color: "var(--mui-palette-warning-main)",
          },
        },
      },
      {
        props: { variant: "text", color: "info" },
        style: {
          "&:not(.Mui-disabled):hover, &:not(.Mui-disabled):active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))":
            {
              backgroundColor: "var(--mui-palette-info-lighterOpacity)",
            },
          "&.Mui-disabled": {
            opacity: 0.45,
            color: "var(--mui-palette-info-main)",
          },
        },
      },
      {
        props: { variant: "text", color: "success" },
        style: {
          "&:not(.Mui-disabled):hover, &:not(.Mui-disabled):active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))":
            {
              backgroundColor: "var(--mui-palette-success-lighterOpacity)",
            },
          "&.Mui-disabled": {
            opacity: 0.45,
            color: "var(--mui-palette-success-main)",
          },
        },
      },
      {
        props: { variant: "outlined", color: "primary" },
        style: {
          borderColor: "var(--mui-palette-primary-main)",
          "&:not(.Mui-disabled):hover, &:not(.Mui-disabled):active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))":
            {
              backgroundColor: "transparent",
              borderColor: "var(--mui-palette-primary-main)",
            },
          "&.Mui-disabled": {
            backgroundColor: "transparent",
            borderColor: "var(--mui-palette-primary-main)",
          },
        },
      },
      {
        props: { variant: "outlined", color: "secondary" },
        style: {
          borderColor: "var(--mui-palette-Button-outline-border)",
          color: "var(--mui-palette-Button-outline-contrastText)",
          "&:not(.Mui-disabled):hover, &:not(.Mui-disabled):active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))":
            {
              backgroundColor: "transparent",
              borderColor: "var(--mui-palette-Button-outline-border)",
            },
          "&.Mui-disabled": {
            backgroundColor: "transparent",
            borderColor: "var(--mui-palette-Button-outline-border)",
          },
        },
      },
      {
        props: { variant: "outlined", color: "error" },
        style: {
          borderColor: "var(--mui-palette-error-main)",
          "&:not(.Mui-disabled):hover, &:not(.Mui-disabled):active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))":
            {
              backgroundColor: "var(--mui-palette-error-lighterOpacity)",
            },
          "&.Mui-disabled": {
            opacity: 0.45,
            color: "var(--mui-palette-error-main)",
            borderColor: "var(--mui-palette-error-main)",
          },
        },
      },
      {
        props: { variant: "outlined", color: "warning" },
        style: {
          borderColor: "var(--mui-palette-warning-main)",
          "&:not(.Mui-disabled):hover, &:not(.Mui-disabled):active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))":
            {
              backgroundColor: "var(--mui-palette-warning-lighterOpacity)",
            },
          "&.Mui-disabled": {
            opacity: 0.45,
            color: "var(--mui-palette-warning-main)",
            borderColor: "var(--mui-palette-warning-main)",
          },
        },
      },
      {
        props: { variant: "outlined", color: "info" },
        style: {
          borderColor: "var(--mui-palette-Button-border)",
          "&:not(.Mui-disabled):hover, &:not(.Mui-disabled):active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))":
            {
              backgroundColor: "var(--mui-palette-info-lighterOpacity)",
            },
          "&.Mui-disabled": {
            opacity: 0.45,
            color: "var(--mui-palette-info-main)",
            borderColor: "var(--mui-palette-info-main)",
          },
        },
      },
      {
        props: { variant: "outlined", color: "success" },
        style: {
          borderColor: "var(--mui-palette-success-main)",
          "&:not(.Mui-disabled):hover, &:not(.Mui-disabled):active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))":
            {
              backgroundColor: "var(--mui-palette-success-lighterOpacity)",
            },
          "&.Mui-disabled": {
            opacity: 0.45,
            color: "var(--mui-palette-success-main)",
            borderColor: "var(--mui-palette-success-main)",
          },
        },
      },
      {
        props: { variant: "contained", color: "primary" },
        style: {
          "&.MuiButton-root": {
            backgroundColor: "var(--mui-palette-primary-main)",
            color: "var(--mui-palette-primary-contrastText)",
          },
          "&:not(.Mui-disabled):active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))":
            {
              backgroundColor: "var(--mui-palette-primary-dark)",
            },
          "&:hover": {
            backgroundColor: "var(--mui-palette-primary-light)",
          },
          "&.Mui-disabled": {
            color: "var(--mui-palette-primary-contrastText)",
            backgroundColor: "var(--mui-palette-action-disabled)",
          },
        },
      },
      {
        props: { variant: "contained", color: "secondary" },
        style: {
          "&:not(.Mui-disabled):active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))":
            {
              backgroundColor: "var(--mui-palette-secondary-dark)",
            },
          "&.Mui-disabled": {
            opacity: 0.45,
            color: "var(--mui-palette-secondary-contrastText)",
            backgroundColor: "var(--mui-palette-secondary-main)",
          },
        },
      },
      {
        props: { variant: "contained", color: "error" },
        style: {
          "&:not(.Mui-disabled):active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))":
            {
              backgroundColor: "var(--mui-palette-error-dark)",
            },
          "&.Mui-disabled": {
            opacity: 0.45,
            color: "var(--mui-palette-error-contrastText)",
            backgroundColor: "var(--mui-palette-error-main)",
          },
        },
      },
      {
        props: { variant: "contained", color: "warning" },
        style: {
          "&:not(.Mui-disabled):active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))":
            {
              backgroundColor: "var(--mui-palette-warning-dark)",
            },
          "&.Mui-disabled": {
            opacity: 0.45,
            color: "var(--mui-palette-warning-contrastText)",
            backgroundColor: "var(--mui-palette-warning-main)",
          },
        },
      },
      {
        props: { variant: "contained", color: "info" },
        style: {
          "&:not(.Mui-disabled):active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))":
            {
              backgroundColor: "var(--mui-palette-info-dark)",
            },
          "&.Mui-disabled": {
            opacity: 0.45,
            color: "var(--mui-palette-info-contrastText)",
            backgroundColor: "var(--mui-palette-info-main)",
          },
        },
      },
      {
        props: { variant: "contained", color: "success" },
        style: {
          "&:not(.Mui-disabled):active, &.Mui-focusVisible:not(:has(span.MuiTouchRipple-root))":
            {
              backgroundColor: "var(--mui-palette-success-dark)",
            },
          "&.Mui-disabled": {
            opacity: 0.45,
            color: "var(--mui-palette-success-contrastText)",
            backgroundColor: "var(--mui-palette-success-main)",
          },
        },
      },
    ],
  },
};

export default button;
