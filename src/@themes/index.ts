import type { ThemeOptions } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

import colorSchemes from "@themes/colorSchemes";
import overrides from "@themes/overrides";
import typography from "@themes/overrides/typography";
import spacing from "@themes/spacing";
import breakpoints from "./breakpoints";

const theme = (direction: Theme["direction"]): ThemeOptions => {
  return {
    cssVariables: {
      colorSchemeSelector: '[data-mui-color-scheme="%s"]',
    },
    direction,
    components: overrides(),
    colorSchemes,
    shape: {
      borderRadius: 6,
      customBorderRadius: {
        xs: 2,
        sm: 4,
        md: 6,
        lg: 8,
        xl: 16,
      },
      height: {
        inputForm: "1.5em",
      },
    },
    breakpoints: breakpoints(),
    customShadows: {
      xs: "0 2px 4px 0 rgba(0, 0, 0, 0.05)",
      sm: "0 2px 5px 0 rgba(0, 0, 0, 0.05)",
      md: "0 4px 8px 0 rgba(0, 0, 0, 0.05)",
      lg: "0 8px 16px 0 rgba(0, 0, 0, 0.05)",
    },
    spacing: spacing.spacing,
    typography: typography("Inter"),
    mainColorChannels: {
      light: "46 38 61",
      dark: "231 227 252",
      lightShadow: "46 38 61",
      darkShadow: "19 17 32",
    },
  };
};

export default theme;
