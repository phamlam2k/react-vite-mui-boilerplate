import { FormProvider, useForm } from "react-hook-form";
import { loginSchemaResolver, type LoginSchema } from "../utils/validations";
import BaseTextFieldForm from "@shared/components/forms/BaseTextFieldForm";
import Button from "@mui/material/Button";
import { useLoginMutate } from "../hooks/useLoginMutate";
import { mapLoginFormToApi } from "../utils/mapLoginForm";

const LoginForm = () => {
  const form = useForm<LoginSchema>({
    resolver: loginSchemaResolver,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useLoginMutate();
  const onSubmit = (data: LoginSchema) => {
    if (isPending) return;

    mutate(mapLoginFormToApi(data));
  };

  return (
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
  );
};

export default LoginForm;
