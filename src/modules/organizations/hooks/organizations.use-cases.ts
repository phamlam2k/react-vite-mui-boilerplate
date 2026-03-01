import { OrganizationsUseCases } from "@modules/organizations/_usecases/organizations.usecases";
import { organizationsApiGateway } from "@modules/organizations/_api/organizations.api";

export const organizationsUseCases = new OrganizationsUseCases(
  organizationsApiGateway
);
