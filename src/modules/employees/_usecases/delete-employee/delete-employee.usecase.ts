/**
 * 🟢 USE CASE LAYER - Business Logic (Pure)
 * Orchestrates delete (terminate) employee logic
 */

import type { IEmployeesPort } from "../employees.port";

export async function deleteEmployeeUseCase(
  api: IEmployeesPort["deleteEmployee"],
  employeeId: string
): Promise<void> {
  if (!employeeId) {
    throw new Error("Nhân viên không tồn tại");
  }
  await api(employeeId);
}
