import commonColors from "./_common";

const darkColors = {
  ...commonColors,
  background: {
    ...commonColors.background,
    contrastText: "var(--mui-palette-common-white)",
    paper: "#2B2C40",
    default: "#232333",
  },
};

export default darkColors;
