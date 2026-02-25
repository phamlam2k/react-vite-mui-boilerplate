/**
 * 🟡 ADAPTER LAYER - UI Component
 * Role form: name, description, permissions (multi-select from catalog)
 */

import Box from "@mui/material/Box";
import BaseSelectForm from "@shared/components/forms/BaseSelectForm";
import BaseTextFieldForm from "@shared/components/forms/BaseTextFieldForm";
import { usePermissionsCatalog } from "../../permissions/hooks/usePermissionsCatalog";

interface RoleFormProps {
  showPermissions?: boolean;
}

export default function RoleForm({ showPermissions = true }: RoleFormProps) {
  const { data: permissions = [] } = usePermissionsCatalog();

  const permissionOptions = permissions.map((p) => ({
    value: p.id,
    label: `${p.key} (${p.group})`,
  }));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
      <BaseTextFieldForm
        required
        name="name"
        label="Tên vai trò"
        placeholder="Ví dụ: Payroll Manager"
      />
      <BaseTextFieldForm
        name="description"
        label="Mô tả"
        placeholder="Mô tả quyền hạn của vai trò"
        multiline
        rows={2}
      />
      {showPermissions && (
        <BaseSelectForm
          name="permissionIds"
          label="Quyền (permissions)"
          placeholder="Chọn quyền gán cho vai trò"
          options={permissionOptions}
          multiple
        />
      )}
    </Box>
  );
}
