import defaultCoreTheme from "@themes/index";
import { createTheme } from "@mui/material/styles";

const direction = "ltr";

const themeCustomConfig = () => {
  return createTheme({
    ...defaultCoreTheme(direction),
  });
};

export default themeCustomConfig;
