import commonColors from "./_common";

const lightColors = {
  ...commonColors,
  primary: {
    ...commonColors.primary,
    contrastText: "#000000",
  },
  background: {
    ...commonColors.background,
    default: "#ffffff",
  },
};

export default lightColors;
