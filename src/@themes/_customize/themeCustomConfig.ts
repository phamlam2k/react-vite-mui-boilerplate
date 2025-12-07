import { createTheme } from "@mui/material/styles";
import theme from "..";

const themeCustomConfig = createTheme({
  ...theme("light", "ltr"),
});
export default themeCustomConfig;
