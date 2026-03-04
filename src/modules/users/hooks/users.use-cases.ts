/**
 * 🟡 ADAPTER - Composition root for users
 */

import { UsersUseCases } from "@modules/users/_usecases/users.usecases";
import { usersApiGateway } from "@modules/users/_api/users.api";
import { currentUserAdapter } from "@shared/adapters/current-user.adapter";

export const usersUseCases = new UsersUseCases(
  usersApiGateway,
  currentUserAdapter
);
