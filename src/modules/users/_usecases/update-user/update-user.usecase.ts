import type { User } from "@modules/users/_domain/users.model";
import { mapUpdateUserFormToApi } from "./update-user.mapper";
import { type UpdateUserSchema } from "./update-user.validation";
import usersApi from "@modules/users/_api/users.api";
import { mapUserProfileToUser } from "../list/list.mapper";
import { pickBy } from "lodash-es";

export async function updateUserUseCase(
  userId: string,
  formData: UpdateUserSchema
): Promise<User> {
  const _formData = pickBy(formData, value => value !== undefined);

  const apiRequest = mapUpdateUserFormToApi(userId, _formData);

  const response = await usersApi.updateUser(apiRequest);

  return mapUserProfileToUser(response);
}
