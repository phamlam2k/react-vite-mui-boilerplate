import { useContext } from "react";
import { GoogleOauth2Context } from "../GoogleOauth2Context";

export const useGoogleOauth2 = () => {
  const context = useContext(GoogleOauth2Context);

  if (!context) {
    throw new Error(
      "useGoogleOauth2 must be used within a GoogleOauth2Provider"
    );
  }

  return context;
};
