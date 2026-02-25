/**
 * 🟢 USE CASE LAYER - Business Logic (Pure)
 * Orchestrates create user logic WITHOUT framework dependencies
 */

import usersApi from "../../_api/users.api";
import type { User } from "../../_domain/users.model";
import { mapCreateUserFormToApi } from "./create.mapper";
import { createUserSchema, type CreateUserSchema } from "./create.validation";
import { mapUserProfileToUser } from "../list/list.mapper";

/**
 * Use Case: Create User
 * Pure function that orchestrates the business logic
 *
 * @param formData - User-provided form data
 * @returns Promise of created user
 */
export async function createUserUseCase(
  formData: CreateUserSchema
): Promise<User> {
  const validatedData = createUserSchema.parse(formData);

  const processedData = {
    ...validatedData,
    username: validatedData.username.toLowerCase(),
  };

  const apiRequest = mapCreateUserFormToApi(processedData);

  const response = await usersApi.createUser(apiRequest);

  const createdUser = mapUserProfileToUser(response);

  return createdUser;
}
