/**
 * 🟡 ADAPTER LAYER - Modal
 * Create a new org unit (name, type, code, description)
 */

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import {
  createOrgSchema,
  type CreateOrgSchema,
} from "@modules/organizations/_usecases/organizations.validations";
import { useCreateOrgMutation } from "../hooks/useCreateOrgMutation";
import OrgForm from "../components/OrgForm";

export type CreateOrgModalProps = {
  onSuccess?: () => void;
};

const CreateOrgModal = ({
  type,
  payload,
}: ModalStack<CreateOrgModalProps>) => {
  const { onSuccess } = payload ?? {};
  const { close } = useModalController();

  const methods = useForm<CreateOrgSchema>({
    resolver: zodResolver(createOrgSchema) as never,
    defaultValues: {
      name: "",
      type: "department",
      code: "",
      description: null,
      parentId: null,
      headEmployeeId: null,
    },
  });

  const { mutate, isPending } = useCreateOrgMutation();

  const onSubmit = (data: CreateOrgSchema) => {
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
          <DialogTitle>Tạo đơn vị tổ chức mới</DialogTitle>
          <DialogContent>
            <OrgForm />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={isPending}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" disabled={isPending}>
              {isPending ? "Đang tạo..." : "Tạo đơn vị"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default CreateOrgModal;
