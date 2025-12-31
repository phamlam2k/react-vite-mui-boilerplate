import GoogleOauth2Provider from "@core/providers/google-oauth2/GoogleOauth2Provider";
import BaseThemeProvider from "@themes/providers/BaseThemeProvider";

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOauth2Provider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      redirectUri={import.meta.env.VITE_GOOGLE_REDIRECT_URI}
    >
      <BaseThemeProvider>{children}</BaseThemeProvider>
    </GoogleOauth2Provider>
  );
};

export default RootProvider;
