/**
 * 🟡 ADAPTER - Composition root for employees
 * Injects gateway + currentUser (Zustand adapter) for use-case-level permission checks.
 */

import { employeesApiGateway } from "@modules/employees/_api/employees.api";
import { EmployeesUseCases } from "@modules/employees/_usecases/employees.usecases";
import { currentUserAdapter } from "@shared/adapters/current-user.adapter";

export const employeesUseCases = new EmployeesUseCases(
  employeesApiGateway,
  currentUserAdapter
);
