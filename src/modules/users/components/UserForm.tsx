import Box from "@mui/material/Box";
import { useGetRolesDropdown } from "@shared/apis/dropdown.hook";
import BaseCheckboxForm from "@shared/components/forms/BaseCheckboxForm";
import BaseSelectForm from "@shared/components/forms/BaseSelectForm";
import BaseTextFieldForm from "@shared/components/forms/BaseTextFieldForm";
import type { Role } from "@modules/roles_permissions/_api/roles/roles.type";

const UserForm = ({ isUpdate = false }: { isUpdate?: boolean }) => {
  const { data: rolesData } = useGetRolesDropdown({
    page: 1,
    pageSize: 500,
  });
  const roleOptions =
    rolesData?.data.map((r: Role) => ({ value: r.id, label: r.name })) ?? [];

  console.log(roleOptions);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
      <BaseTextFieldForm
        required
        name="username"
        label="Username"
        placeholder="Enter username"
      />
      <BaseTextFieldForm
        required
        name="email"
        label="Email"
        placeholder="Enter email"
      />

      {!isUpdate && (
        <>
          <BaseTextFieldForm
            name="password"
            required
            label="Password"
            placeholder="Enter password"
            type="password"
          />

          <BaseTextFieldForm
            name="confirmPassword"
            required
            label="Confirm Password"
            placeholder="Enter confirm password"
            type="password"
          />
        </>
      )}

      <BaseTextFieldForm
        required
        name="firstName"
        label="First Name"
        placeholder="Enter first name"
      />
      <BaseTextFieldForm
        required
        name="lastName"
        label="Last Name"
        placeholder="Enter last name"
      />
      <BaseCheckboxForm name="isActive" label="Is Active" />
      <BaseSelectForm
        name="roleIds"
        label="Role"
        placeholder="Select role"
        options={roleOptions}
        multiple
      />
    </Box>
  );
};

export default UserForm;
