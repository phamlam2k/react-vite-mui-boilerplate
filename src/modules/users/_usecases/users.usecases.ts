import type { IUsersPort } from "./users.port";
import type {
  User,
  UsersFilters,
  UsersList,
} from "@modules/users/_domain/users.model";
import {
  usersFiltersSchema,
  createUserSchema,
  updateUserSchema,
  type CreateUserSchema,
  type UpdateUserSchema,
} from "./users.validations";
import {
  mapFiltersToApiParams,
  mapUserProfileToUser,
  mapUserProfilesToUsers,
  mapCreateUserFormToApi,
  mapUpdateUserFormToApi,
} from "./users.mappers";
import { pickBy } from "lodash-es";

export class UsersUseCases {
  private readonly api: IUsersPort;

  constructor(api: IUsersPort) {
    this.api = api;
  }

  async getList(filters: UsersFilters): Promise<UsersList> {
    const validated = usersFiltersSchema.parse(filters);
    const params = mapFiltersToApiParams(validated);
    const response = await this.api.getUsersList(params);
    return {
      data: mapUserProfilesToUsers(response.data),
      meta: response.meta,
    };
  }

  async create(
    formData: CreateUserSchema & { tenantId: string }
  ): Promise<User> {
    const { tenantId, ...rest } = formData;
    const validated = createUserSchema.parse(rest);
    const processed = {
      ...validated,
      username: validated.username.toLowerCase(),
      tenantId,
    };
    const request = mapCreateUserFormToApi(processed);
    const response = await this.api.createUser(request);
    return mapUserProfileToUser(response);
  }

  async getById(userId: string): Promise<User> {
    if (!userId) throw new Error("Người dùng không tồn tại");
    const response = await this.api.getUserById(userId);
    return mapUserProfileToUser(response);
  }

  async update(
    userId: string,
    formData: Partial<UpdateUserSchema>
  ): Promise<User> {
    const cleaned = pickBy(
      formData,
      (v): v is NonNullable<typeof v> => v !== undefined
    );
    const payload = mapUpdateUserFormToApi(userId, cleaned);
    const response = await this.api.updateUser(payload);
    return mapUserProfileToUser(response);
  }

  async delete(userId: string): Promise<void> {
    if (!userId) throw new Error("Người dùng không tồn tại");
    await this.api.deleteUser(userId);
  }

  async exportToCsv(filters: UsersFilters): Promise<string> {
    const allFilters: UsersFilters = {
      ...filters,
      page: 1,
      pageSize: 1000,
    };
    const list = await this.getList(allFilters);
    const headers = ["Username", "Email", "Full Name", "Role", "Status"];
    const rows = list.data.map(user => [
      user.username,
      user.email,
      user.fullName,
      user.displayRole,
      user.isActive ? "Active" : "Inactive",
    ]);
    return [headers, ...rows].map(row => row.join(",")).join("\n");
  }
}
