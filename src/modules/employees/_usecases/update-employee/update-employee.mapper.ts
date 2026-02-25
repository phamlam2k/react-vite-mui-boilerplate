/**
 * 🟢 USE CASE LAYER - Data Mapper
 * Transform update employee form to API request
 */

import type { EmployeeUpdateRequestBody } from "../../_api/employees.type";
import type { UpdateEmployeeSchema } from "./update-employee.validation";
import { pickBy } from "lodash-es";

export function mapUpdateEmployeeFormToApi(
  employeeId: string,
  formData: Partial<UpdateEmployeeSchema>
): EmployeeUpdateRequestBody {
  const data = pickBy(
    formData,
    (v): v is NonNullable<typeof v> => v !== undefined
  );
  return {
    employeeId,
    data,
  };
}
