import { createContext, useCallback, useContext } from "react";
import type { SignInWithGoogleProps } from "./utils/google";
import signInWithGoogleFn from "./utils/google";

type GoogleOauth2ContextType = {
  signInWithGoogle: () => void;
};

interface GoogleOauth2ProviderProps extends SignInWithGoogleProps {
  children: React.ReactNode;
}

const GoogleOauth2Context = createContext<GoogleOauth2ContextType>({
  signInWithGoogle: () => {
    throw new Error("signInWithGoogle is not implemented");
  },
});

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

export const useGoogleOauth2 = () => {
  const context = useContext(GoogleOauth2Context);

  if (!context) {
    throw new Error(
      "useGoogleOauth2 must be used within a GoogleOauth2Provider"
    );
  }

  return context;
};
