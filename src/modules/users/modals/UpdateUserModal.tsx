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

import UserForm from "../components/UserForm";
import { useUpdateUserMutation } from "../hooks/useUpdateUserMutation";
import {
  updateUserSchema,
  type UpdateUserSchema,
} from "../_usecases/update-user/update-user.validation";
import useGetUserDetail from "../hooks/useGetUserDetail";
import { useEffect } from "react";

export type UpdateUserModalProps = {
  userId: string;
  onSuccess?: () => void;
};

const UpdateUserModal = ({
  type,
  payload,
}: ModalStack<UpdateUserModalProps>) => {
  const { userId, onSuccess } = payload || {};
  const { close } = useModalController();
  const { data: userDetail, isLoading: isLoadingUserDetail } =
    useGetUserDetail(userId);

  // Form setup
  const methods = useForm({
    resolver: zodResolver(updateUserSchema),
  });

  const { handleSubmit } = methods;

  // Mutation
  const { mutate, isPending } = useUpdateUserMutation();

  useEffect(() => {
    if (isLoadingUserDetail) return;

    if (userDetail) {
      methods.reset(userDetail);
    }
  }, [userDetail, isLoadingUserDetail]);

  const onSubmit = (data: UpdateUserSchema) => {
    mutate(
      { userId, formData: data },
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
          <DialogTitle>Sửa người dùng</DialogTitle>

          <DialogContent>
            <UserForm isUpdate={true} />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} disabled={isPending}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" disabled={isPending}>
              {isPending ? "Đang cập nhật..." : "Cập nhật người dùng"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default UpdateUserModal;
