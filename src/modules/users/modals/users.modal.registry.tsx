/**
 * Modal Registry for Users Module
 * Register all user-related modals here
 */

import CreateUserModal from "./CreateUserModal";
import UpdateUserModal from "./UpdateUserModal";

export const UsersModalKeys = {
  CreateUserModal: "CreateUserModal",
  UpdateUserModal: "UpdateUserModal",
} as const;

const usersModalRegistry = {
  [UsersModalKeys.CreateUserModal]: CreateUserModal,
  [UsersModalKeys.UpdateUserModal]: UpdateUserModal,
};

export default usersModalRegistry;
