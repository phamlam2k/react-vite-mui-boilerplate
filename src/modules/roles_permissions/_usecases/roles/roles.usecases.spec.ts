import { describe, it, expect, vi, beforeEach } from "vitest";
import { RolesUseCases } from "./roles.usecases";
import type { IRolesPort } from "./roles.port";
import type { ICurrentUserPort } from "@shared/ports/current-user.port";

describe("RolesUseCases", () => {
  const mockRoleDto = {
    id: "role-1",
    tenantId: "tenant-1",
    name: "Admin",
    description: "Admin role",
    isSystem: false,
    permissionCount: 2,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  const mockPermissionData = {
    id: "p1",
    key: "roles.manage",
    group: "roles",
    description: "Manage roles",
  };

  let mockApi: IRolesPort;
  let mockCurrentUser: ICurrentUserPort | null;

  beforeEach(() => {
    mockApi = {
      listRoles: vi.fn().mockResolvedValue({
        data: [mockRoleDto],
        meta: { total: 1, page: 1, pageSize: 20 },
      }),
      createRole: vi.fn().mockResolvedValue(mockRoleDto),
      getRoleById: vi.fn().mockResolvedValue(mockRoleDto),
      updateRole: vi
        .fn()
        .mockResolvedValue({ ...mockRoleDto, name: "Updated" }),
      deleteRole: vi.fn().mockResolvedValue(undefined),
      getRolePermissions: vi.fn().mockResolvedValue({
        data: [mockPermissionData],
      }),
      setRolePermissions: vi.fn().mockResolvedValue({
        data: [mockPermissionData],
      }),
    };
    mockCurrentUser = null;
  });

  describe("getList", () => {
    it("validates filters, calls api.listRoles, returns mapped list", async () => {
      const useCases = new RolesUseCases(mockApi, mockCurrentUser);
      const result = await useCases.getList({ page: 1, pageSize: 10 });

      expect(mockApi.listRoles).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({
        id: mockRoleDto.id,
        name: mockRoleDto.name,
        description: mockRoleDto.description,
      });
      expect(result.meta).toEqual({ total: 1, page: 1, pageSize: 20 });
    });

    it("applies search when provided", async () => {
      const useCases = new RolesUseCases(mockApi, mockCurrentUser);
      await useCases.getList({ page: 1, pageSize: 20, search: "admin" });

      expect(mockApi.listRoles).toHaveBeenCalledWith(
        expect.objectContaining({ search: "admin" })
      );
    });
  });

  describe("create", () => {
    const validForm = {
      name: "Editor",
      description: "Can edit",
      permissionIds: [] as string[],
    };

    it("throws when user has no roles.manage permission", async () => {
      mockCurrentUser = {
        getPermissions: vi.fn().mockReturnValue(["roles.view"]),
        getUserId: vi.fn().mockReturnValue("user-1"),
      };
      const useCases = new RolesUseCases(mockApi, mockCurrentUser);

      await expect(useCases.create(validForm)).rejects.toThrow(
        "Bạn không có quyền tạo vai trò"
      );
      expect(mockApi.createRole).not.toHaveBeenCalled();
    });

    it("calls api.createRole and returns mapped role when user has roles.manage", async () => {
      mockCurrentUser = {
        getPermissions: vi.fn().mockReturnValue(["roles.manage"]),
        getUserId: vi.fn().mockReturnValue("user-1"),
      };
      const useCases = new RolesUseCases(mockApi, mockCurrentUser);

      const result = await useCases.create(validForm);

      expect(mockApi.createRole).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Editor",
          description: "Can edit",
          permissionIds: [],
        })
      );
      expect(result).toMatchObject({
        id: mockRoleDto.id,
        name: mockRoleDto.name,
      });
    });

    it("allows create when currentUser is null (authz skipped)", async () => {
      const useCases = new RolesUseCases(mockApi, null);
      const result = await useCases.create(validForm);
      expect(mockApi.createRole).toHaveBeenCalled();
      expect(result).toMatchObject({ id: mockRoleDto.id });
    });
  });

  describe("getById", () => {
    it("throws when roleId is empty", async () => {
      const useCases = new RolesUseCases(mockApi, mockCurrentUser);
      await expect(useCases.getById("")).rejects.toThrow(
        "Vai trò không tồn tại"
      );
      await expect(useCases.getById(null as unknown as string)).rejects.toThrow(
        "Vai trò không tồn tại"
      );
    });

    it("calls api.getRoleById and returns mapped role", async () => {
      const useCases = new RolesUseCases(mockApi, mockCurrentUser);
      const result = await useCases.getById("role-1");

      expect(mockApi.getRoleById).toHaveBeenCalledWith("role-1");
      expect(result).toMatchObject({ id: "role-1", name: "Admin" });
    });
  });

  describe("update", () => {
    it("cleans undefined fields, calls api.updateRole, returns mapped role", async () => {
      const useCases = new RolesUseCases(mockApi, mockCurrentUser);
      const result = await useCases.update("role-1", { name: "Updated Name" });

      expect(mockApi.updateRole).toHaveBeenCalledWith(
        expect.objectContaining({
          roleId: "role-1",
          data: expect.objectContaining({ name: "Updated Name" }),
        })
      );
      expect(result).toBeDefined();
    });
  });

  describe("delete", () => {
    it("throws when user has no roles.manage permission", async () => {
      mockCurrentUser = {
        getPermissions: vi.fn().mockReturnValue([]),
        getUserId: vi.fn().mockReturnValue("user-1"),
      };
      const useCases = new RolesUseCases(mockApi, mockCurrentUser);

      await expect(useCases.delete("role-1")).rejects.toThrow(
        "Bạn không có quyền xóa vai trò"
      );
      expect(mockApi.deleteRole).not.toHaveBeenCalled();
    });

    it("throws when roleId is empty", async () => {
      mockCurrentUser = {
        getPermissions: vi.fn().mockReturnValue(["roles.manage"]),
        getUserId: vi.fn().mockReturnValue("user-1"),
      };
      const useCases = new RolesUseCases(mockApi, mockCurrentUser);

      await expect(useCases.delete("")).rejects.toThrow(
        "Vai trò không tồn tại"
      );
    });

    it("calls api.deleteRole when user has permission and roleId is valid", async () => {
      mockCurrentUser = {
        getPermissions: vi.fn().mockReturnValue(["roles.manage"]),
        getUserId: vi.fn().mockReturnValue("user-1"),
      };
      const useCases = new RolesUseCases(mockApi, mockCurrentUser);

      await useCases.delete("role-1");

      expect(mockApi.deleteRole).toHaveBeenCalledWith("role-1");
    });

    it("allows delete when currentUser is null (authz skipped)", async () => {
      const useCases = new RolesUseCases(mockApi, null);
      await useCases.delete("role-1");
      expect(mockApi.deleteRole).toHaveBeenCalledWith("role-1");
    });
  });

  describe("getRolePermissions", () => {
    it("throws when roleId is empty", async () => {
      const useCases = new RolesUseCases(mockApi, mockCurrentUser);
      await expect(useCases.getRolePermissions("")).rejects.toThrow(
        "Vai trò không tồn tại"
      );
    });

    it("calls api.getRolePermissions and returns mapped permissions", async () => {
      const useCases = new RolesUseCases(mockApi, mockCurrentUser);
      const result = await useCases.getRolePermissions("role-1");

      expect(mockApi.getRolePermissions).toHaveBeenCalledWith("role-1");
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: mockPermissionData.id,
        key: mockPermissionData.key,
        group: mockPermissionData.group,
        description: mockPermissionData.description,
      });
    });
  });

  describe("setRolePermissions", () => {
    it("calls api.setRolePermissions with roleId and permissionIds, returns mapped list", async () => {
      const useCases = new RolesUseCases(mockApi, mockCurrentUser);
      const permissionIds = ["p1", "p2"];

      const result = await useCases.setRolePermissions("role-1", permissionIds);

      expect(mockApi.setRolePermissions).toHaveBeenCalledWith("role-1", {
        permissionIds,
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ id: "p1", key: "roles.manage" });
    });
  });
});
