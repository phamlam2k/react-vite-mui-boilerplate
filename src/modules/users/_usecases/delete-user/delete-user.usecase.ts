import usersApi from "@modules/users/_api/users.api";
import { mapUserProfileToUser } from "../list/list.mapper";

export async function deleteUserUseCase(userId: string) {
  if (!userId) {
    throw new Error("Người dùng không tồn tại");
  }

  const response = await usersApi.deleteUser(userId);

  const deletedUser = mapUserProfileToUser(response.data);

  return deletedUser;
}
