/**
 * 🟡 ADAPTER LAYER - Modal Component
 * Create user modal with form
 */

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserSchema,
  type CreateUserSchema,
} from "../_usecases/create/create.validation";
import { useCreateUserMutation } from "../hooks/useCreateUserMutation";
import UserForm from "../components/UserForm";
import { UsersModalKeys } from "./users.modal.registry";

export type CreateUserModalProps = {
  onSuccess?: () => void;
};

const CreateUserModal = ({
  type,
  payload,
}: ModalStack<CreateUserModalProps>) => {
  const { onSuccess } = payload || {};
  const { close } = useModalController();

  // Form setup
  const methods = useForm({
    resolver: zodResolver(createUserSchema),
  });

  const { handleSubmit } = methods;

  // Mutation
  const { mutate, isPending } = useCreateUserMutation();

  const onSubmit = (data: CreateUserSchema) => {
    mutate(data, {
      onSuccess: () => {
        onSuccess?.();
        close(type);
      },
    });
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
