import type { Theme } from "@mui/material/styles";

const paper: Theme["components"] = {
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: {},
    },
  },
};

export default paper;
