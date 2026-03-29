/**
 * 🟡 ADAPTER LAYER - UI Component
 * Shared form fields for Create / Update OrgUnit
 */

import Box from "@mui/material/Box";
import BaseTextFieldForm from "@shared/components/forms/BaseTextFieldForm";
import BaseSelectForm from "@shared/components/forms/BaseSelectForm";
import type { OrgUnitType } from "@modules/organizations/_domain/organizations.model";

// Display labels — UI concern, không thuộc Domain layer
const typeOptions: Array<{ value: OrgUnitType; label: string }> = [
  { value: "company", label: "Công ty" },
  { value: "business_unit", label: "Đơn vị kinh doanh" },
  { value: "department", label: "Phòng ban" },
  { value: "team", label: "Nhóm" },
];

const activeOptions = [
  { value: true, label: "Đang hoạt động" },
  { value: false, label: "Ngừng hoạt động" },
];

interface OrgFormProps {
  showIsActive?: boolean;
}

export default function OrgForm({ showIsActive = false }: OrgFormProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
      <BaseTextFieldForm
        required
        name="name"
        label="Tên đơn vị"
        placeholder="Ví dụ: Phòng Kỹ thuật"
      />
      <BaseSelectForm
        required
        name="type"
        label="Loại đơn vị"
        placeholder="Chọn loại"
        options={typeOptions}
      />
      <BaseTextFieldForm
        name="code"
        label="Mã đơn vị"
        placeholder="Ví dụ: ENG-001"
      />
      <BaseTextFieldForm
        name="description"
        label="Mô tả"
        placeholder="Mô tả ngắn về đơn vị"
        multiline
        rows={2}
      />
      {showIsActive && (
        <BaseSelectForm
          name="isActive"
          label="Trạng thái"
          options={activeOptions}
        />
      )}
    </Box>
  );
}
