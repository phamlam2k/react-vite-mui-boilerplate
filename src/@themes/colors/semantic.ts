import { ColorNames } from "@scripts/utils";
import baseColors from "./base";
import useColorsStore from "@shared/stores/colors.store";

const semanticColor = () => {
  const colorPrimary = useColorsStore.getState().colors;

  return {
    brand: {
      primary: {
        main: baseColors[colorPrimary as keyof typeof baseColors][600],
        hover: baseColors[colorPrimary as keyof typeof baseColors][700],
        active: baseColors[colorPrimary as keyof typeof baseColors][800],
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
        main: baseColors[ColorNames.Green][600],
        hover: baseColors[ColorNames.Green][700],
        active: baseColors[ColorNames.Green][800],
        contrastText: "var(--mui-palette-common-white)",
      },
      warning: {
        main: baseColors[ColorNames.Amber][600],
        hover: baseColors[ColorNames.Amber][700],
        active: baseColors[ColorNames.Amber][800],
        contrastText: "var(--mui-palette-common-white)",
      },
      error: {
        main: baseColors[ColorNames.Red][600],
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
      paper: baseColors.gray[100],
    },
  };
};

export default semanticColor;
