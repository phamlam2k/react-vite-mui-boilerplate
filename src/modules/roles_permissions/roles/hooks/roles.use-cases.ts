/**
 * 🟡 ADAPTER - Composition root for roles
 */

import { rolesApiGateway } from "@modules/roles_permissions/_api/roles/roles.api";
import { RolesUseCases } from "@modules/roles_permissions/_usecases/roles/roles.usecases";
import { currentUserAdapter } from "@shared/adapters/current-user.adapter";

export const rolesUseCases = new RolesUseCases(
  rolesApiGateway,
  currentUserAdapter
);
