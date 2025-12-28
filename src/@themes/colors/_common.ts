import semanticColor from "./semantic";

const commonColors = {
  primary: {
    ...semanticColor().brand.primary,
  },
  secondary: {
    ...semanticColor().brand.secondary,
  },
  error: {
    ...semanticColor().status.error,
  },
  warning: {
    ...semanticColor().status.warning,
  },
  info: {
    ...semanticColor().status.info,
  },
  text: {
    ...semanticColor().text,
  },
  background: {
    surface: semanticColor().background.surface,
    paper: semanticColor().background.paper,
  },
};

export default commonColors;
