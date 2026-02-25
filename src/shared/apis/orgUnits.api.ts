import axiosInstance from "@core/axios";
import type { components } from "@core/api-contract/openapi";

type OrgUnitListResponse = components["schemas"]["OrgUnitListResponse"];

export type OrgUnitListParams = {
  page?: number;
  pageSize?: number;
  type?: "company" | "business_unit" | "department" | "team";
  parentId?: string;
  isActive?: boolean;
  search?: string;
};

const orgUnitsApi = {
  getList: async (params?: OrgUnitListParams) => {
    const response = await axiosInstance.get<OrgUnitListResponse>(
      "/organizations",
      { params }
    );
    return response.data;
  },
};

export default orgUnitsApi;
