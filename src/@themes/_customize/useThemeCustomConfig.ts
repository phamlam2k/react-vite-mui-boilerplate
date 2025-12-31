import defaultCoreTheme from "@themes/index";
import { createTheme } from "@mui/material/styles";
import useColorsStore from "@shared/stores/colors.store";
import { deepmerge } from "@mui/utils";

const direction = "ltr";

const useThemeCustomConfig = () => {
  const color = useColorsStore((state) => state.color);
  let theme = { ...defaultCoreTheme(direction) };

  const primaryColor = {
    main: color[600],
    hover: color[700],
    active: color[800],
    lightOpacity: color[100],
    contrastText: "var(--mui-palette-common-white)",
  };

  theme = deepmerge(theme, {
    colorSchemes: {
      light: {
        palette: {
          primary: {
            ...primaryColor,
          },
        },
      },
      dark: {
        palette: {
          primary: {
            ...primaryColor,
          },
        },
      },
    },
  });

  return createTheme({
    ...theme,
  });
};

export default useThemeCustomConfig;
