/**
 * 🟡 ADAPTER LAYER - UI Component
 * Employee form for create/update (create includes contract section)
 */

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BaseSelectForm from "@shared/components/forms/BaseSelectForm";
import BaseTextFieldForm from "@shared/components/forms/BaseTextFieldForm";
import { useOrgUnitsList } from "@shared/apis/orgUnits.hook";
import {
  STATUS_LABELS,
  WORK_MODE_LABELS,
  GENDER_LABELS,
  CONTRACT_TYPE_LABELS,
  PAY_SCHEDULE_LABELS,
} from "../_domain/employees.rules";

const genderOptions = Object.entries(GENDER_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const workModeOptions = Object.entries(WORK_MODE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const contractTypeOptions = Object.entries(CONTRACT_TYPE_LABELS).map(
  ([value, label]) => ({ value, label })
);

const payScheduleOptions = Object.entries(PAY_SCHEDULE_LABELS).map(
  ([value, label]) => ({ value, label })
);

interface EmployeeFormProps {
  isUpdate?: boolean;
}

export default function EmployeeForm({ isUpdate = false }: EmployeeFormProps) {
  const { data: orgUnitsData } = useOrgUnitsList({
    page: 1,
    pageSize: 500,
    isActive: true,
  });
  const orgUnitOptions =
    orgUnitsData?.data.map((ou) => ({ value: ou.id, label: ou.name })) ?? [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
      <BaseTextFieldForm
        required
        name="firstName"
        label="Họ"
        placeholder="Nhập họ"
      />
      <BaseTextFieldForm
        required
        name="lastName"
        label="Tên"
        placeholder="Nhập tên"
      />
      <BaseTextFieldForm
        required
        name="email"
        label="Email"
        placeholder="email@example.com"
        type="email"
      />
      <BaseTextFieldForm
        name="phone"
        label="Số điện thoại"
        placeholder="+84901234567"
      />

      {!isUpdate && (
        <>
          <BaseSelectForm
            name="gender"
            label="Giới tính"
            placeholder="Chọn giới tính"
            options={genderOptions}
          />
          <BaseTextFieldForm
            name="dateOfBirth"
            label="Ngày sinh"
            placeholder="YYYY-MM-DD"
            type="date"
          />
          <BaseTextFieldForm
            name="nationalId"
            label="CMND/CCCD"
            placeholder="Nhập số CMND/CCCD"
          />
          <BaseTextFieldForm
            name="taxId"
            label="Mã số thuế"
            placeholder="Nhập mã số thuế"
          />
        </>
      )}

      <BaseSelectForm
        required
        name="orgUnitId"
        label="Đơn vị công tác"
        placeholder="Chọn đơn vị"
        options={orgUnitOptions}
      />
      <BaseTextFieldForm
        required
        name="positionTitle"
        label="Chức vụ"
        placeholder="Ví dụ: Senior Software Engineer"
      />
      <BaseTextFieldForm
        name="managerId"
        label="Mã quản lý (UUID)"
        placeholder="UUID của quản lý trực tiếp"
      />

      {!isUpdate && (
        <>
          <BaseTextFieldForm
            required
            name="hireDate"
            label="Ngày vào làm"
            type="date"
          />
          <BaseSelectForm
            required
            name="workMode"
            label="Hình thức làm việc"
            placeholder="Chọn hình thức"
            options={workModeOptions}
          />
        </>
      )}

      {isUpdate && (
        <>
          <BaseSelectForm
            name="status"
            label="Trạng thái"
            placeholder="Chọn trạng thái"
            options={statusOptions}
          />
          <BaseSelectForm
            name="workMode"
            label="Hình thức làm việc"
            placeholder="Chọn hình thức"
            options={workModeOptions}
          />
          <BaseTextFieldForm
            name="terminationDate"
            label="Ngày chấm dứt"
            type="date"
          />
        </>
      )}

      {/* Contract section - create only */}
      {!isUpdate && (
        <>
          <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>
            Hợp đồng
          </Typography>
          <BaseSelectForm
            required
            name="contract.type"
            label="Loại hợp đồng"
            placeholder="Chọn loại"
            options={contractTypeOptions}
          />
          <BaseTextFieldForm
            required
            name="contract.startDate"
            label="Ngày bắt đầu hợp đồng"
            type="date"
          />
          <BaseTextFieldForm
            name="contract.endDate"
            label="Ngày kết thúc (nếu có)"
            type="date"
          />
          <BaseTextFieldForm
            required
            name="contract.baseSalary"
            label="Lương cơ bản"
            type="number"
            placeholder="0"
          />
          <BaseTextFieldForm
            required
            name="contract.currency"
            label="Đơn vị tiền tệ"
            placeholder="VND"
          />
          <BaseSelectForm
            required
            name="contract.paySchedule"
            label="Kỳ trả lương"
            placeholder="Chọn kỳ"
            options={payScheduleOptions}
          />
          <BaseTextFieldForm
            name="contract.payGrade"
            label="Bậc lương"
            placeholder="L4"
          />
        </>
      )}
    </Box>
  );
}
