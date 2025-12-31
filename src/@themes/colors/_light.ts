import commonColors from "./_common";

const lightColors = {
  ...commonColors,
  primary: {
    ...commonColors.primary,
    contrastText: "var(--mui-palette-common-white)",
  },
  background: {
    ...commonColors.background,
    contrastText: "var(--mui-palette-common-black)",
    paper: "var(--mui-palette-common-white)",
    default: "#e9eaee",
  },
};

export default lightColors;
