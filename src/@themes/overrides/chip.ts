import type { Theme } from "@mui/material/styles";

const chip: Theme["components"] = {
  MuiChip: {
    variants: [
      {
        props: { color: "primary" },
        style: {
          "& .MuiChip-label": {
            color: "var(--mui-palette-common-white)",
          },
        },
      },
    ],
  },
};

export default chip;
