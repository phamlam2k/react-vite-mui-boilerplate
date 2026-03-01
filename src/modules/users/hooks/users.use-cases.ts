import { UsersUseCases } from "@modules/users/_usecases/users.usecases";
import { usersApiGateway } from "@modules/users/_api/users.api";

export const usersUseCases = new UsersUseCases(usersApiGateway);
