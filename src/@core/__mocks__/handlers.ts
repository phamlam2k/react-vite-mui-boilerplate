import { authHandlers } from "./handlers/auth/index.js";
import { usersHandlers } from "./handlers/users/index.js";
import { employeesHandlers } from "./handlers/employees/index.js";
import { organizationsHandlers } from "./handlers/organizations/index.js";
import { permissionsHandlers } from "./handlers/permissions/index.js";

export const handlers = [
  ...authHandlers,
  ...usersHandlers,
  ...employeesHandlers,
  ...organizationsHandlers,
  ...permissionsHandlers,
];
