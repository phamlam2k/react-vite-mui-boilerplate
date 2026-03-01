/**
 * 🟡 ADAPTER LAYER - Modal Component
 * Create user modal with form
 */

import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  type CreateUserSchema,
} from "../_usecases/users.validations";
import { useCreateUserMutation } from "../hooks/useCreateUserMutation";
import UserForm from "../components/UserForm";
import { UsersModalKeys } from "./users.modal.registry";
import { useGetAuthMe } from "@shared/apis/auth.hook";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export type CreateUserModalProps = {
  onSuccess?: () => void;
};

const CreateUserModal = ({
  type,
  payload,
}: ModalStack<CreateUserModalProps>) => {
  const { data: authMeData } = useGetAuthMe();
  const { onSuccess } = payload || {};
  const { close } = useModalController();

  // Form setup
  const methods = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema) as never,
  });

  const { handleSubmit } = methods;

  // Mutation
  const { mutate, isPending } = useCreateUserMutation();

  const onSubmit = (data: CreateUserSchema) => {
    const tenantId = authMeData?.tenantId;

    console.log(tenantId);
    console.log(data);

    mutate(
      {
        ...data,
        tenantId,
      },
      {
        onSuccess: () => {
          onSuccess?.();
          close(type);
        },
      }
    );
  };

  const handleClose = () => {
    if (!isPending) {
      close(type);
    }
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {type === UsersModalKeys.CreateUserModal
              ? "Tạo người dùng mới"
              : "Sửa người dùng"}
          </DialogTitle>

          <DialogContent>
            <UserForm />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} disabled={isPending}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" disabled={isPending}>
              {isPending ? "Đang tạo..." : "Tạo người dùng"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default CreateUserModal;
