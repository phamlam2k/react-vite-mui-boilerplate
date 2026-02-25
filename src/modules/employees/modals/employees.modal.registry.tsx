/**
 * Modal Registry for Employees (HRM) Module
 */

import CreateEmployeeModal from "./CreateEmployeeModal";
import UpdateEmployeeModal from "./UpdateEmployeeModal";

export const EmployeesModalKeys = {
  CreateEmployeeModal: "CreateEmployeeModal",
  UpdateEmployeeModal: "UpdateEmployeeModal",
} as const;

const employeesModalRegistry = {
  [EmployeesModalKeys.CreateEmployeeModal]: CreateEmployeeModal,
  [EmployeesModalKeys.UpdateEmployeeModal]: UpdateEmployeeModal,
};

export default employeesModalRegistry;
