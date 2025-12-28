import type { Theme } from "@mui/material/styles";

const text: Theme["components"] = {
  MuiTypography: {
    defaultProps: {
      color: "var(--mui-palette-primary-contrastText)",
    },
  },
};

export default text;
