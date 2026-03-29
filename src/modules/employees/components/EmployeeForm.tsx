/**
 * 🟡 ADAPTER LAYER - UI Component
 * Employee form for create/update (create includes contract section)
 */

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BaseSelectForm from "@shared/components/forms/BaseSelectForm";
import BaseTextFieldForm from "@shared/components/forms/BaseTextFieldForm";
import { useOrgUnitsList } from "@shared/apis/orgUnits.hook";

// Display options — UI concern, không thuộc Domain layer
const genderOptions = [
  { value: "male", label: "Nam" },
  { value: "female", label: "Nữ" },
  { value: "other", label: "Khác" },
  { value: "prefer_not_to_say", label: "Không tiết lộ" },
];

const workModeOptions = [
  { value: "office", label: "Văn phòng" },
  { value: "remote", label: "Làm từ xa" },
  { value: "hybrid", label: "Kết hợp" },
];

const statusOptions = [
  { value: "probation", label: "Thử việc" },
  { value: "active", label: "Đang làm việc" },
  { value: "on_leave", label: "Nghỉ phép" },
  { value: "terminated", label: "Đã nghỉ" },
];

const contractTypeOptions = [
  { value: "probation", label: "Thử việc" },
  { value: "fixed_term", label: "Có thời hạn" },
  { value: "permanent", label: "Không thời hạn" },
  { value: "part_time", label: "Bán thời gian" },
  { value: "contractor", label: "Hợp đồng" },
];

const payScheduleOptions = [
  { value: "monthly", label: "Tháng" },
  { value: "bi_weekly", label: "Hai tuần" },
  { value: "weekly", label: "Tuần" },
];

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
    orgUnitsData?.data.map(ou => ({ value: ou.id, label: ou.name })) ?? [];

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
