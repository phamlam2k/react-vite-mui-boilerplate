import { CssBaseline, ThemeProvider } from "@mui/material";
import { themeConfig } from "../../constants/config";
import themeCustomConfig from "@themes/_customize/themeCustomConfig";
import GoogleOauth2Provider from "@core/providers/google-oauth2/GoogleOauth2Provider";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOauth2Provider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      redirectUri={import.meta.env.VITE_GOOGLE_REDIRECT_URI}
    >
      <ThemeProvider
        theme={themeCustomConfig()}
        modeStorageKey={`${themeConfig.templateName
          .toLowerCase()
          .split(" ")
          .join("-")}-mode`}
      >
        <CssBaseline />
        {children}
      </ThemeProvider>
    </GoogleOauth2Provider>
  );
};

export default RootLayout;
