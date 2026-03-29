/**
 * 🟡 ADAPTER LAYER - Modal
 * Update an existing org unit (name, code, description, isActive)
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
import { useEffect } from "react";
import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import {
  updateOrgSchema,
  type UpdateOrgSchema,
} from "@modules/organizations/_usecases/organizations.validations";
import { useUpdateOrgMutation } from "../hooks/useUpdateOrgMutation";
import { useGetOrgDetail } from "../hooks/useGetOrgDetail";
import OrgForm from "../components/OrgForm";

export type UpdateOrgModalProps = {
  orgId: string;
  onSuccess?: () => void;
};

const UpdateOrgModal = ({
  type,
  payload,
}: ModalStack<UpdateOrgModalProps>) => {
  const { orgId, onSuccess } = payload ?? {};
  const { close } = useModalController();

  const { data: orgDetail, isLoading: isLoadingDetail } = useGetOrgDetail(
    orgId ?? ""
  );

  const methods = useForm<Partial<UpdateOrgSchema>>({
    resolver: zodResolver(updateOrgSchema) as never,
  });

  const { mutate, isPending } = useUpdateOrgMutation();

  useEffect(() => {
    if (isLoadingDetail || !orgDetail) return;
    methods.reset({
      name: orgDetail.name,
      code: orgDetail.code ?? "",
      description: orgDetail.description ?? null,
      isActive: orgDetail.isActive,
      headEmployeeId: orgDetail.headEmployeeId ?? null,
    });
  }, [orgDetail, isLoadingDetail, methods]);

  const onSubmit = (data: Partial<UpdateOrgSchema>) => {
    if (!orgId) return;
    mutate(
      { orgId, formData: data },
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
          <DialogTitle>Cập nhật đơn vị tổ chức</DialogTitle>
          <DialogContent>
            {isLoadingDetail ? (
              <div style={{ padding: "24px 0", textAlign: "center" }}>
                Đang tải...
              </div>
            ) : (
              <OrgForm showIsActive />
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

export default UpdateOrgModal;
