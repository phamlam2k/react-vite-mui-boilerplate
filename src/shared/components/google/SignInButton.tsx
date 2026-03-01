import Button from "@mui/material/Button";
import Google from "@mui/icons-material/Google";
import { useGoogleOauth2 } from "@core/providers/google-oauth2/hooks/useGoogleOauth2";

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
