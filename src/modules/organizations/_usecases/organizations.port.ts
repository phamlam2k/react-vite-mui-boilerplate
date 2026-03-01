import type {
  OrganizationsListParams,
  OrganizationsListResponse,
} from "@modules/organizations/_api/organizations.type";

export interface IOrganizationsPort {
  getOrganizationsList(
    params: OrganizationsListParams
  ): Promise<OrganizationsListResponse>;
}
