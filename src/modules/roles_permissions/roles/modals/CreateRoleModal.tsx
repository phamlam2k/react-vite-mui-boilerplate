/**
 * 🟡 ADAPTER LAYER - Modal
 * Create role (name, description, permissions)
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
  createRoleSchema,
  type CreateRoleSchema,
} from "@modules/roles_permissions/_usecases/roles/create-role/create-role.validation";
import { useCreateRoleMutation } from "../hooks/useCreateRoleMutation";
import RoleForm from "../components/RoleForm";

export type CreateRoleModalProps = {
  onSuccess?: () => void;
};

const CreateRoleModal = ({
  type,
  payload,
}: ModalStack<CreateRoleModalProps>) => {
  const { onSuccess } = payload ?? {};
  const { close } = useModalController();

  const methods = useForm<CreateRoleSchema>({
    resolver: zodResolver(createRoleSchema) as never,
    defaultValues: {
      name: "",
      description: null,
      permissionIds: [],
    },
  });

  const { mutate, isPending } = useCreateRoleMutation();

  const onSubmit = (data: CreateRoleSchema) => {
    mutate(data, {
      onSuccess: () => {
        onSuccess?.();
        close(type);
      },
    });
  };

  const handleClose = () => {
    if (!isPending) close(type);
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <DialogTitle>Tạo vai trò mới</DialogTitle>
          <DialogContent>
            <RoleForm showPermissions={true} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={isPending}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" disabled={isPending}>
              {isPending ? "Đang tạo..." : "Tạo vai trò"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default CreateRoleModal;
