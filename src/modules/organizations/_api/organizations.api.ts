import axiosInstance from "@core/axios";
import type {
  OrganizationsListParams,
  OrganizationsListResponse,
} from "./organizations.type";

export const OrganizationsApiRoutes = {
  Organizations: "/organizations",
};

const organizationsApi = {
  getOrganizationsList: async (params: OrganizationsListParams) => {
    const response = await axiosInstance.get<OrganizationsListResponse>(
      OrganizationsApiRoutes.Organizations,
      { params }
    );
    return response.data;
  },
};

export default organizationsApi;
