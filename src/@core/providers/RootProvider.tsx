import { queryClient } from "@core/constants/config";
import GoogleOauth2Provider from "@core/providers/google-oauth2/GoogleOauth2Provider";
import { QueryClientProvider } from "@tanstack/react-query";
import BaseThemeProvider from "@themes/providers/BaseThemeProvider";

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOauth2Provider
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
        redirectUri={import.meta.env.VITE_GOOGLE_REDIRECT_URI}
      >
        <BaseThemeProvider>{children}</BaseThemeProvider>
      </GoogleOauth2Provider>
    </QueryClientProvider>
  );
};

export default RootProvider;
