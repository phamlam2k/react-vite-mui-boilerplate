import { ColorNames } from "@scripts/utils";
import baseColors from "./base";

const semanticColor = {
  brand: {
    primary: {
      main: baseColors[ColorNames.Blue][500],
      hover: baseColors[ColorNames.Blue][700],
      active: baseColors[ColorNames.Blue][800],
      lightOpacity: baseColors[ColorNames.Blue][100],
      contrastText: "var(--mui-palette-common-white)",
    },
    secondary: {
      main: baseColors[ColorNames.Gray][500],
      hover: baseColors[ColorNames.Gray][600],
      active: baseColors[ColorNames.Gray][700],
      contrastText: "var(--mui-palette-common-white)",
    },
  },

  status: {
    success: {
      main: baseColors[ColorNames.Green][500],
      hover: baseColors[ColorNames.Green][700],
      active: baseColors[ColorNames.Green][800],
      contrastText: "var(--mui-palette-common-white)",
    },
    warning: {
      main: baseColors[ColorNames.Amber][500],
      hover: baseColors[ColorNames.Amber][700],
      active: baseColors[ColorNames.Amber][800],
      contrastText: "var(--mui-palette-common-white)",
    },
    error: {
      main: baseColors[ColorNames.Red][500],
      hover: baseColors[ColorNames.Red][700],
      active: baseColors[ColorNames.Red][800],
      contrastText: "var(--mui-palette-common-white)",
    },
    info: {
      main: baseColors[ColorNames.Blue][500],
      hover: baseColors[ColorNames.Blue][600],
      active: baseColors[ColorNames.Blue][700],
      contrastText: "var(--mui-palette-common-white)",
    },
  },

  text: {
    primary: baseColors.gray[900],
    secondary: baseColors.gray[700],
    disabled: baseColors.gray[400],
  },

  background: {
    surface: baseColors.gray[50],
  },
};

export default semanticColor;
