import { useCallback } from "react";
import type { SignInWithGoogleProps } from "./utils/google";
import signInWithGoogleFn from "./utils/google";
import { GoogleOauth2Context } from "./GoogleOauth2Context";

interface GoogleOauth2ProviderProps extends SignInWithGoogleProps {
  children: React.ReactNode;
}

const GoogleOauth2Provider = ({
  clientId,
  redirectUri,
  scope,
  state,
  children,
}: GoogleOauth2ProviderProps) => {
  const signInWithGoogle = useCallback(() => {
    signInWithGoogleFn({
      clientId,
      redirectUri,
      scope,
      state,
    });
  }, [clientId, redirectUri, scope, state]);

  return (
    <GoogleOauth2Context.Provider value={{ signInWithGoogle }}>
      {children}
    </GoogleOauth2Context.Provider>
  );
};

export default GoogleOauth2Provider;
