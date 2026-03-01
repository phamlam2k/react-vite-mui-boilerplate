/**
 * 🟡 ADAPTER LAYER - Modal Component
 * Create employee (onboard) modal with form and contract
 */

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEmployeeSchema,
  type CreateEmployeeSchema,
} from "@modules/employees/_usecases/employees.validations";
import { useCreateEmployeeMutation } from "../hooks/useCreateEmployeeMutation";
import EmployeeForm from "../components/EmployeeForm";
import DialogTitle from "@mui/material/DialogTitle";

export type CreateEmployeeModalProps = {
  onSuccess?: () => void;
};

const defaultValues: Partial<CreateEmployeeSchema> = {
  workMode: "office",
  contract: {
    type: "permanent",
    startDate: "",
    endDate: null,
    baseSalary: 0,
    currency: "VND",
    paySchedule: "monthly",
    payGrade: null,
  },
};

const CreateEmployeeModal = ({
  type,
  payload,
}: ModalStack<CreateEmployeeModalProps>) => {
  const { onSuccess } = payload ?? {};
  const { close } = useModalController();

  const methods = useForm<CreateEmployeeSchema>({
    resolver: zodResolver(createEmployeeSchema) as never,
    defaultValues,
  });

  const { mutate, isPending } = useCreateEmployeeMutation();

  const onSubmit = (data: CreateEmployeeSchema) => {
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
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <DialogTitle>Tuyển dụng nhân viên mới</DialogTitle>

          <DialogContent>
            <EmployeeForm />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} disabled={isPending}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" disabled={isPending}>
              {isPending ? "Đang tạo..." : "Tạo nhân viên"}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default CreateEmployeeModal;
