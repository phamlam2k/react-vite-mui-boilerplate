import type { operations } from "@core/api-contract/openapi";
import axiosInstance from "@core/axios";

export const DropdownApiRoutes = {
  RolesDropdown: "/roles",
} as const;

export type DropdownRolesListRequest =
  operations["listRoles"]["parameters"]["query"];

const dropdownApi = {
  getRolesDropdown: async (params: DropdownRolesListRequest) => {
    const response = await axiosInstance.get(DropdownApiRoutes.RolesDropdown, {
      params,
    });
    return response.data;
  },
};

export default dropdownApi;
