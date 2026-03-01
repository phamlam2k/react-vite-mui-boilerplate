import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";
import LoginForm from "../components/LoginForm";
import SignInButton from "@shared/components/google/SignInButton";

function LoginPage() {
  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-md h-fit border border-gray-200 rounded-md p-4">
          <h1 className="text-2xl font-bold text-center">
            Welcome to the system
          </h1>

          <LoginForm />

          <div className="my-4 border-t border-gray-200" />

          <div className="flex flex-col gap-2">
            <SignInButton />
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<GitHubIcon />}
            >
              Login with Github
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
