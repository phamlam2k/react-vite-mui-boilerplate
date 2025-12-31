import { themeConfig } from "@core/constants/config";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import GlobalStyling from "../globalStyles";
import useThemeCustomConfig from "../_customize/useThemeCustomConfig";

const BaseThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useThemeCustomConfig();

  return (
    <ThemeProvider
      theme={theme}
      modeStorageKey={`${themeConfig.templateName
        .toLowerCase()
        .split(" ")
        .join("-")}-mode`}
    >
      <GlobalStyles styles={() => GlobalStyling(theme) as any} />
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default BaseThemeProvider;
