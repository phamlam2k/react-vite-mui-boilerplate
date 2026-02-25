import type { UserUpdateRequestBody } from "@modules/users/_api/users.type";
import type { UpdateUserSchema } from "./update-user.validation";

export function mapUpdateUserFormToApi(
  userId: string,
  formData: UpdateUserSchema
): UserUpdateRequestBody {
  return {
    userId,
    data: formData,
  };
}
