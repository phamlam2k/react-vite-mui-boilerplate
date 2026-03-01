import axiosInstance from "@core/axios";
import type { IOrganizationsPort } from "@modules/organizations/_usecases/organizations.port";
import type {
  OrganizationsListParams,
  OrganizationsListResponse,
} from "./organizations.type";

export const OrganizationsApiRoutes = {
  Organizations: "/organizations",
} as const;

export class OrganizationsApiGateway implements IOrganizationsPort {
  async getOrganizationsList(
    params: OrganizationsListParams
  ): Promise<OrganizationsListResponse> {
    const response = await axiosInstance.get<OrganizationsListResponse>(
      OrganizationsApiRoutes.Organizations,
      { params }
    );
    return response.data;
  }
}

export const organizationsApiGateway = new OrganizationsApiGateway();
