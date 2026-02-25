/**
 * 🟢 USE CASE LAYER - Data Mapper
 * Transform create user form to API request
 */

import { omit } from "lodash-es";
import type { UserCreateRequest } from "../../_api/users.type";
import type { CreateUserSchema } from "./create.validation";

/**
 * Map form data to API create request
 */
export function mapCreateUserFormToApi(
  formData: CreateUserSchema
): UserCreateRequest {
  const _formData = omit(formData, ["confirmPassword"]);

  return {
    ..._formData,
  };
}
