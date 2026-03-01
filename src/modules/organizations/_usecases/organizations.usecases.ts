import type { IOrganizationsPort } from "./organizations.port";
import type {
  OrganizationsListParams,
  OrganizationsListResponse,
} from "@modules/organizations/_api/organizations.type";

export class OrganizationsUseCases {
  private readonly api: IOrganizationsPort;

  constructor(api: IOrganizationsPort) {
    this.api = api;
  }

  async getList(
    params: OrganizationsListParams
  ): Promise<OrganizationsListResponse> {
    return this.api.getOrganizationsList(params);
  }
}
