import { createContext } from "react";

type GoogleOauth2ContextType = {
  signInWithGoogle: () => void;
};

export const GoogleOauth2Context = createContext<GoogleOauth2ContextType>({
  signInWithGoogle: () => {
    throw new Error("signInWithGoogle is not implemented");
  },
});
