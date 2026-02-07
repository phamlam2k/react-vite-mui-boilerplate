import { FormProvider, useForm } from "react-hook-form";
import { loginSchemaResolver, type LoginSchema } from "../utils/validations";
import BaseTextFieldForm from "@shared/components/forms/BaseTextFieldForm";
import Button from "@mui/material/Button";
import { Google, GitHub } from "@mui/icons-material";
import SignInButton from "@core/providers/google-oauth2/components/SignInButton";

function LoginPage() {
  const form = useForm<LoginSchema>({
    resolver: loginSchemaResolver,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginSchema) => {
    console.log(data);
  };

  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full flex justify-center items-center">
        <div className="w-md h-fit border border-gray-200 rounded-md p-4">
          <h1 className="text-2xl font-bold text-center">
            Welcome to the system
          </h1>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 mt-5"
            >
              <BaseTextFieldForm
                name="email"
                label="Email"
                placeholder="Enter your email"
              />
              <BaseTextFieldForm
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
              />
              <Button type="submit" variant="contained" color="primary">
                Login
              </Button>
            </form>
          </FormProvider>

          <div className="my-4 border-t border-gray-200" />

          <div className="flex flex-col gap-2">
            <SignInButton />
            <Button variant="outlined" color="secondary" startIcon={<GitHub />}>
              Login with Github
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
