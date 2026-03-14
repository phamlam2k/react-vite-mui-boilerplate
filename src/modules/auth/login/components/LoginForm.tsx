import { FormProvider, useForm } from "react-hook-form";
import BaseTextFieldForm from "@shared/components/forms/BaseTextFieldForm";
import Button from "@mui/material/Button";
import { useLoginMutate } from "../hooks/useLoginMutate";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginSchema,
} from "@modules/auth/_usecases/auth.validations";
import { setAuthTokens } from "@core/axios";
import { syncAuthFromUserProfile } from "@shared/stores/auth.store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const LoginForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");

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
        if (response?.tokens) {
          const { accessToken, refreshToken, expiresIn } = response.tokens;
          setAuthTokens(accessToken, refreshToken, expiresIn);
        }
        if (response?.user) syncAuthFromUserProfile(response.user);
        toast.success(t("loginSuccess"));
        navigate("/");
      },
      onError: () => {
        toast.error(t("loginFailed"));
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
          label={t("email")}
          placeholder={t("emailPlaceholder")}
        />
        <BaseTextFieldForm
          name="password"
          label={t("password")}
          type="password"
          placeholder={t("passwordPlaceholder")}
        />
        <Button type="submit" variant="contained" color="primary">
          {t("loginButton")}
        </Button>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
