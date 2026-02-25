import CreateRoleModal from "@modules/roles_permissions/roles/modals/CreateRoleModal";
import UpdateRoleModal from "@modules/roles_permissions/roles/modals/UpdateRoleModal";
import RolePermissionsModal from "@modules/roles_permissions/roles/modals/RolePermissionsModal";

export const RolesModalKeys = {
  CreateRoleModal: "CreateRoleModal",
  UpdateRoleModal: "UpdateRoleModal",
  RolePermissionsModal: "RolePermissionsModal",
} as const;

const rolesModalRegistry = {
  [RolesModalKeys.CreateRoleModal]: CreateRoleModal,
  [RolesModalKeys.UpdateRoleModal]: UpdateRoleModal,
  [RolesModalKeys.RolePermissionsModal]: RolePermissionsModal,
};

export default rolesModalRegistry;
