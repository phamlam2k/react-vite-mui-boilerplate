/**
 * 🟡 ADAPTER LAYER - Modal
 * Update role name/description
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
import { useEffect } from "react";
import {
  updateRoleSchema,
  type UpdateRoleSchema,
} from "@modules/roles_permissions/_usecases/roles/update-role/update-role.validation";
import { useUpdateRoleMutation } from "../hooks/useUpdateRoleMutation";
import { useGetRoleDetail } from "../hooks/useGetRoleDetail";
import RoleForm from "../components/RoleForm";

export type UpdateRoleModalProps = {
  roleId: string;
  onSuccess?: () => void;
};

const UpdateRoleModal = ({
  type,
  payload,
}: ModalStack<UpdateRoleModalProps>) => {
  const { roleId, onSuccess } = payload ?? {};
  const { close } = useModalController();
  const { data: roleDetail, isLoading: isLoadingDetail } =
    useGetRoleDetail(roleId ?? "");

  const methods = useForm<Partial<UpdateRoleSchema>>({
    resolver: zodResolver(updateRoleSchema) as never,
  });

  const { mutate, isPending } = useUpdateRoleMutation();

  useEffect(() => {
    if (isLoadingDetail || !roleDetail) return;
    methods.reset({
      name: roleDetail.name,
      description: roleDetail.description ?? null,
    });
  }, [roleDetail, isLoadingDetail, methods]);

  const onSubmit = (data: Partial<UpdateRoleSchema>) => {
    if (!roleId) return;
    mutate(
      { roleId, formData: data },
      {
        onSuccess: () => {
          onSuccess?.();
          close(type);
        },
      }
    );
  };

  const handleClose = () => {
    if (!isPending) close(type);
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="sm" fullWidth>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <DialogTitle>Cập nhật vai trò</DialogTitle>
          <DialogContent>
            {isLoadingDetail ? (
              <div>Đang tải...</div>
            ) : (
              <RoleForm showPermissions={false} />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={isPending}>
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending || isLoadingDetail}
            >
              {isPending ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default UpdateRoleModal;
