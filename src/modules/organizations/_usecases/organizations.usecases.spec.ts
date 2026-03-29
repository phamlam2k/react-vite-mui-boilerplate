import { describe, it, expect, vi, beforeEach } from "vitest";
import { OrganizationsUseCases } from "./organizations.usecases";
import type { IOrganizationsPort } from "./organizations.port";
import type { ICurrentUserPort } from "@shared/ports/current-user.port";
import { ForbiddenError, NotFoundError } from "@shared/errors/app.errors";
import type { OrgUnit } from "@modules/organizations/_api/organizations.type";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const orgDto: OrgUnit = {
  id: "org-1",
  tenantId: "tenant-1",
  name: "Phòng Kỹ thuật",
  type: "department",
  parentId: "org-0",
  code: "ENG-001",
  description: "Engineering team",
  isActive: true,
  headEmployeeId: "emp-1",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-02T00:00:00Z",
};

const meta = { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 };

// Helpers tạo user với quyền tương ứng
const asManager = (): ICurrentUserPort => ({
  getPermissions: vi.fn().mockReturnValue(["organization.manage"]),
  getUserId: vi.fn().mockReturnValue("user-1"),
});

const asViewer = (): ICurrentUserPort => ({
  getPermissions: vi.fn().mockReturnValue(["organization.view"]),
  getUserId: vi.fn().mockReturnValue("user-1"),
});

// ---------------------------------------------------------------------------

describe("OrganizationsUseCases", () => {
  let api: IOrganizationsPort;

  beforeEach(() => {
    api = {
      getList: vi.fn().mockResolvedValue({ data: [orgDto], meta }),
      create: vi.fn().mockResolvedValue(orgDto),
      getById: vi.fn().mockResolvedValue(orgDto),
      update: vi.fn().mockResolvedValue({ ...orgDto, name: "Updated" }),
      delete: vi.fn().mockResolvedValue(undefined),
      getChildren: vi.fn().mockResolvedValue({ data: [orgDto], meta }),
    };
  });

  // -------------------------------------------------------------------------
  // getList — không cần auth, tập trung vào mapping và filter
  // -------------------------------------------------------------------------

  describe("getList", () => {
    it("forwards pagination and active filters to API", async () => {
      const uc = new OrganizationsUseCases(api, null);
      await uc.getList({
        page: 2,
        pageSize: 10,
        search: "tech",
        type: "department",
        isActive: true,
      });

      expect(api.getList).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
          pageSize: 10,
          search: "tech",
          type: "department",
          isActive: true,
        })
      );
    });

    it("strips empty/all filters — API không nhận param thừa", async () => {
      const uc = new OrganizationsUseCases(api, null);
      await uc.getList({
        page: 1,
        pageSize: 20,
        search: "",
        type: "all",
        isActive: "all",
      });

      const [params] = vi.mocked(api.getList).mock.calls[0];
      expect(params).not.toHaveProperty("search");
      expect(params).not.toHaveProperty("type");
      expect(params).not.toHaveProperty("isActive");
    });

    it("maps DTO sang domain model — các trường optional thành null khi thiếu", async () => {
      const minimal: OrgUnit = {
        id: "org-2",
        tenantId: "t-1",
        name: "Cty ABC",
        type: "company",
        isActive: true,
        createdAt: "",
        updatedAt: "",
      };
      vi.mocked(api.getList).mockResolvedValueOnce({ data: [minimal], meta });

      const uc = new OrganizationsUseCases(api, null);
      const { data } = await uc.getList({ page: 1, pageSize: 20 });

      expect(data[0]).toMatchObject({
        id: "org-2",
        type: "company",
        parentId: null,
        code: null,
        headEmployeeId: null,
      });
    });

    it("throws validation error khi pageSize vượt giới hạn", async () => {
      const uc = new OrganizationsUseCases(api, null);
      await expect(uc.getList({ page: 1, pageSize: 9999 })).rejects.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // create
  // -------------------------------------------------------------------------

  describe("create", () => {
    const form = { name: "Phòng Marketing", type: "department" as const };

    it("throws ForbiddenError khi user không có quyền manage", async () => {
      const uc = new OrganizationsUseCases(api, asViewer());
      await expect(uc.create(form)).rejects.toThrow(ForbiddenError);
      expect(api.create).not.toHaveBeenCalled();
    });

    it("cho phép tạo khi user có quyền manage", async () => {
      const uc = new OrganizationsUseCases(api, asManager());
      const result = await uc.create(form);
      expect(result.id).toBe("org-1");
    });

    it("trim tên và code trước khi gửi API", async () => {
      const uc = new OrganizationsUseCases(api, null);
      await uc.create({ ...form, name: "  Phòng MKT  ", code: "  MKT-1  " });

      expect(api.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Phòng MKT", code: "MKT-1" })
      );
    });

    it("gửi undefined cho code rỗng — không gửi empty string", async () => {
      const uc = new OrganizationsUseCases(api, null);
      await uc.create({ ...form, code: "" });

      const [req] = vi.mocked(api.create).mock.calls[0];
      expect(req.code).toBeUndefined();
    });

    it("throws validation error khi name rỗng hoặc type không hợp lệ", async () => {
      const uc = new OrganizationsUseCases(api, null);
      await expect(uc.create({ ...form, name: "" })).rejects.toThrow();
      await expect(
        uc.create({ ...form, type: "invalid" as never })
      ).rejects.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // getById
  // -------------------------------------------------------------------------

  describe("getById", () => {
    it("throws NotFoundError khi orgId rỗng", async () => {
      const uc = new OrganizationsUseCases(api, null);
      await expect(uc.getById("")).rejects.toThrow(NotFoundError);
      expect(api.getById).not.toHaveBeenCalled();
    });

    it("trả về domain model đúng khi orgId hợp lệ", async () => {
      const uc = new OrganizationsUseCases(api, null);
      const result = await uc.getById("org-1");

      expect(api.getById).toHaveBeenCalledWith("org-1");
      expect(result).toMatchObject({
        id: "org-1",
        type: "department",
        code: "ENG-001",
      });
    });
  });

  // -------------------------------------------------------------------------
  // update
  // -------------------------------------------------------------------------

  describe("update", () => {
    it("throws ForbiddenError khi user không có quyền manage", async () => {
      const uc = new OrganizationsUseCases(api, asViewer());
      await expect(uc.update("org-1", { name: "X" })).rejects.toThrow(
        ForbiddenError
      );
      expect(api.update).not.toHaveBeenCalled();
    });

    it("throws NotFoundError khi orgId rỗng", async () => {
      const uc = new OrganizationsUseCases(api, asManager());
      await expect(uc.update("", { name: "X" })).rejects.toThrow(NotFoundError);
    });

    it("gửi đúng payload tới API", async () => {
      const uc = new OrganizationsUseCases(api, asManager());
      await uc.update("org-1", { name: "R&D", isActive: false });

      expect(api.update).toHaveBeenCalledWith(
        expect.objectContaining({
          orgId: "org-1",
          data: expect.objectContaining({ name: "R&D", isActive: false }),
        })
      );
    });

    it("gửi undefined cho code rỗng khi update", async () => {
      const uc = new OrganizationsUseCases(api, asManager());
      await uc.update("org-1", { code: "" });

      const [payload] = vi.mocked(api.update).mock.calls[0];
      expect(payload.data.code).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // delete
  // -------------------------------------------------------------------------

  describe("delete", () => {
    it("throws ForbiddenError khi user không có quyền manage", async () => {
      const uc = new OrganizationsUseCases(api, asViewer());
      await expect(uc.delete("org-1")).rejects.toThrow(ForbiddenError);
      expect(api.delete).not.toHaveBeenCalled();
    });

    it("throws NotFoundError khi orgId rỗng", async () => {
      const uc = new OrganizationsUseCases(api, asManager());
      await expect(uc.delete("")).rejects.toThrow(NotFoundError);
    });

    it("gọi api.delete đúng orgId khi hợp lệ", async () => {
      const uc = new OrganizationsUseCases(api, asManager());
      await uc.delete("org-1");
      expect(api.delete).toHaveBeenCalledWith("org-1");
    });
  });

  // -------------------------------------------------------------------------
  // getChildren
  // -------------------------------------------------------------------------

  describe("getChildren", () => {
    it("throws NotFoundError khi orgId rỗng", async () => {
      const uc = new OrganizationsUseCases(api, null);
      await expect(uc.getChildren("")).rejects.toThrow(NotFoundError);
    });

    it("trả về mảng domain model của các đơn vị con", async () => {
      const uc = new OrganizationsUseCases(api, null);
      const result = await uc.getChildren("org-0");

      expect(api.getChildren).toHaveBeenCalledWith("org-0");
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("org-1");
    });

    it("trả về mảng rỗng khi không có con", async () => {
      vi.mocked(api.getChildren).mockResolvedValueOnce({ data: [], meta });
      const uc = new OrganizationsUseCases(api, null);
      await expect(uc.getChildren("org-leaf")).resolves.toEqual([]);
    });
  });

  // -------------------------------------------------------------------------
  // Authorization — tổng hợp
  // Thay vì lặp lại trong từng describe, kiểm tra tập trung ở đây
  // -------------------------------------------------------------------------

  describe("authorization", () => {
    const form = { name: "Test", type: "team" as const };

    it("null currentUser → bỏ qua kiểm tra quyền, tất cả mutation đều chạy được", async () => {
      const uc = new OrganizationsUseCases(api, null);
      await expect(uc.create(form)).resolves.toBeDefined();
      await expect(uc.update("org-1", { name: "X" })).resolves.toBeDefined();
      await expect(uc.delete("org-1")).resolves.toBeUndefined();
    });

    it("viewer → tất cả mutation bị từ chối với ForbiddenError", async () => {
      const uc = new OrganizationsUseCases(api, asViewer());
      await expect(uc.create(form)).rejects.toThrow(ForbiddenError);
      await expect(uc.update("org-1", { name: "X" })).rejects.toThrow(
        ForbiddenError
      );
      await expect(uc.delete("org-1")).rejects.toThrow(ForbiddenError);
    });
  });
});
