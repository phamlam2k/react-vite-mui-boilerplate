/**
 * 🟡 ADAPTER - Composition Root for organizations
 * Wires gateway + currentUserAdapter into OrganizationsUseCases
 */

import { organizationsApiGateway } from "@modules/organizations/_api/organizations.api";
import { OrganizationsUseCases } from "@modules/organizations/_usecases/organizations.usecases";
import { currentUserAdapter } from "@shared/adapters/current-user.adapter";

export const organizationsUseCases = new OrganizationsUseCases(
  organizationsApiGateway,
  currentUserAdapter
);
