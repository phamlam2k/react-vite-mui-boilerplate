/**
 * 🟡 GATEWAY LAYER - HTTP Adapter
 * Implements IOrganizationsPort — full CRUD for org units
 */

import axiosInstance from "@core/axios";
import { generatePath } from "react-router";
import type { IOrganizationsPort } from "@modules/organizations/_usecases/organizations.port";
import type {
  OrgUnit,
  OrgUnitCreateRequest,
  OrgUnitListResponse,
  OrgUnitUpdateRequestBody,
  OrgsListParams,
} from "./organizations.type";

export const OrgsApiRoutes = {
  List: "/organizations",
  ById: "/organizations/:orgId",
  Children: "/organizations/:orgId/children",
} as const;

export class OrganizationsApiGateway implements IOrganizationsPort {
  async getList(params: OrgsListParams): Promise<OrgUnitListResponse> {
    const response = await axiosInstance.get<OrgUnitListResponse>(
      OrgsApiRoutes.List,
      { params }
    );
    return response.data;
  }

  async create(data: OrgUnitCreateRequest): Promise<OrgUnit> {
    const response = await axiosInstance.post<OrgUnit>(
      OrgsApiRoutes.List,
      data
    );
    return response.data;
  }

  async getById(orgId: string): Promise<OrgUnit> {
    const response = await axiosInstance.get<OrgUnit>(
      generatePath(OrgsApiRoutes.ById, { orgId })
    );
    return response.data;
  }

  async update(payload: OrgUnitUpdateRequestBody): Promise<OrgUnit> {
    const response = await axiosInstance.patch<OrgUnit>(
      generatePath(OrgsApiRoutes.ById, { orgId: payload.orgId }),
      payload.data
    );
    return response.data;
  }

  async delete(orgId: string): Promise<void> {
    await axiosInstance.delete(generatePath(OrgsApiRoutes.ById, { orgId }));
  }

  async getChildren(orgId: string): Promise<OrgUnitListResponse> {
    const response = await axiosInstance.get<OrgUnitListResponse>(
      generatePath(OrgsApiRoutes.Children, { orgId })
    );
    return response.data;
  }
}

export const organizationsApiGateway = new OrganizationsApiGateway();
