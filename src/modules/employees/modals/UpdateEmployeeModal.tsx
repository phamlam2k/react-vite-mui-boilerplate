/**
 * 🟡 ADAPTER LAYER - Modal Component
 * Update employee modal with form
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
import EmployeeForm from "../components/EmployeeForm";
import { useUpdateEmployeeMutation } from "../hooks/useUpdateEmployeeMutation";
import {
  updateEmployeeSchema,
  type UpdateEmployeeSchema,
} from "@modules/employees/_usecases/employees.validations";
import { useGetEmployeeDetail } from "../hooks/useGetEmployeeDetail";

export type UpdateEmployeeModalProps = {
  employeeId: string;
  onSuccess?: () => void;
};

const UpdateEmployeeModal = ({
  type,
  payload,
}: ModalStack<UpdateEmployeeModalProps>) => {
  const { employeeId, onSuccess } = payload ?? {};
  const { close } = useModalController();
  const { data: employeeDetail, isLoading: isLoadingDetail } =
    useGetEmployeeDetail(employeeId ?? "");

  const methods = useForm<Partial<UpdateEmployeeSchema>>({
    resolver: zodResolver(updateEmployeeSchema),
  });

  const { mutate, isPending } = useUpdateEmployeeMutation();

  useEffect(() => {
    if (isLoadingDetail) return;
    if (employeeDetail) {
      methods.reset({
        firstName: employeeDetail.firstName,
        lastName: employeeDetail.lastName,
        phone: employeeDetail.phone ?? undefined,
        orgUnitId: employeeDetail.orgUnitId,
        positionTitle: employeeDetail.positionTitle,
        managerId: employeeDetail.managerId ?? undefined,
        status: employeeDetail.status,
        workMode: employeeDetail.workMode ?? undefined,
        terminationDate: employeeDetail.terminationDate ?? undefined,
      });
    }
  }, [employeeDetail, isLoadingDetail, methods]);

  const onSubmit = (data: Partial<UpdateEmployeeSchema>) => {
    if (!employeeId) return;
    mutate(
      { employeeId, formData: data },
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
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <DialogTitle>Cập nhật nhân viên</DialogTitle>

          <DialogContent>
            {isLoadingDetail ? (
              <div>Đang tải...</div>
            ) : (
              <EmployeeForm isUpdate={true} />
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

export default UpdateEmployeeModal;
