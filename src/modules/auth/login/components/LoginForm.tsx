import { FormProvider, useForm } from "react-hook-form";
import BaseTextFieldForm from "@shared/components/forms/BaseTextFieldForm";
import Button from "@mui/material/Button";
import { useLoginMutate } from "../hooks/useLoginMutate";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginSchema,
} from "@modules/auth/_usecases/auth.validations";
import { syncAuthFromUserProfile } from "@shared/stores/auth.store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const LoginForm = () => {
  const navigate = useNavigate();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useLoginMutate();
  const onSubmit = (data: LoginSchema) => {
    if (isPending) return;

    mutate(data, {
      onSuccess: response => {
        if (response?.user) syncAuthFromUserProfile(response.user);
        toast.success("Login successful");
        navigate("/");
      },
      onError: () => {
        toast.error("Login failed");
      },
    });
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
