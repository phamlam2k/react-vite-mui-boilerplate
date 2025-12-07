import { CssBaseline, ThemeProvider } from "@mui/material";
import { themeConfig } from "../constants/config";
import themeCustomConfig from "@themes/_customize/themeCustomConfig";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      theme={themeCustomConfig}
      defaultMode={"light"}
      modeStorageKey={`${themeConfig.templateName
        .toLowerCase()
        .split(" ")
        .join("-")}-mode`}
    >
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
};

export default RootLayout;
