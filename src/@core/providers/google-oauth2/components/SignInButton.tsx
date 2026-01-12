import Button from "@mui/material/Button";
import { useGoogleOauth2 } from "../GoogleOauth2Provider";
import { Google } from "@mui/icons-material";

const SignInButton = () => {
  const { signInWithGoogle } = useGoogleOauth2();

  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<Google />}
      onClick={signInWithGoogle}
    >
      Sign in with Google
    </Button>
  );
};

export default SignInButton;
