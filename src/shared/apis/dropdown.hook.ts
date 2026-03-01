import { useQuery } from "@tanstack/react-query";
import dropdownApi, { type DropdownRolesListRequest } from "./dropdown.api";

export const DropdownKeys = {
  RolesDropdown: () => ["rolesDropdown"] as const,
  RolesDropdownList: (params: DropdownRolesListRequest) =>
    [...DropdownKeys.RolesDropdown(), params] as const,
};

export const useGetRolesDropdown = (params: DropdownRolesListRequest) => {
  return useQuery({
    queryKey: DropdownKeys.RolesDropdownList(params),
    queryFn: () => dropdownApi.getRolesDropdown(params),
  });
};
