import commonColors from "./_common";

const lightColors = {
  ...commonColors,
  primary: {
    ...commonColors.primary,
    contrastText: "var(--mui-palette-common-white)",
  },
  background: {
    ...commonColors.background,
    default: "#ffffff",
  },
};

export default lightColors;
