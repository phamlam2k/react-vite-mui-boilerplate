import { describe, it, expect, vi, beforeEach } from "vitest";
import { LeaveUseCases } from "./leave.usecases";
import type { ILeavePort } from "./leave.port";
import type { ICurrentUserPort } from "@shared/ports/current-user.port";
import { ForbiddenError, NotFoundError } from "@shared/errors/app.errors";
import type {
  LeaveRequestDTO,
  LeaveBalanceDTO,
  LeavePolicyDTO,
} from "@modules/leave/_api/leave.type";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

// Use valid UUID-format IDs so Zod schema validation passes in tests
const IDS = {
  request: "lr1a2b3c-d5e6-7890-abcd-ef1234567890",
  tenant: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  employee: "e1a2b3c4-d5e6-7890-abcd-ef1234567890",
  policy: "lp1a2b3c-d5e6-7890-abcd-ef1234567890",
  manager: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  balance: "lb1a2b3c-d5e6-7890-abcd-ef1234567890",
};

const leaveRequestDto: LeaveRequestDTO = {
  id: IDS.request,
  tenantId: IDS.tenant,
  employeeId: IDS.employee,
  employeeName: "Nguyễn Văn A",
  policyId: IDS.policy,
  policyName: "Nghỉ phép năm",
  policyCode: "ANNUAL",
  startDate: "2024-07-15",
  endDate: "2024-07-19",
  totalDays: 5,
  halfDay: false,
  halfDayType: null,
  reason: "Nghỉ dưỡng sức",
  attachmentUrls: [],
  status: "submitted",
  approvalChain: [
    {
      approverId: IDS.manager,
      approverName: "Trần Thị B",
      decision: "pending",
      decidedAt: null,
      comment: null,
    },
  ],
  createdAt: "2024-07-08T09:00:00Z",
  updatedAt: "2024-07-08T09:00:00Z",
};

const balanceDto: LeaveBalanceDTO = {
  id: IDS.balance,
  tenantId: IDS.tenant,
  employeeId: IDS.employee,
  employeeName: "Nguyễn Văn A",
  policyId: IDS.policy,
  policyName: "Nghỉ phép năm",
  policyCode: "ANNUAL",
  entitled: 12,
  accrued: 6,
  used: 2,
  pending: 1,
  remaining: 3,
  year: 2024,
};

const policyDto: LeavePolicyDTO = {
  id: IDS.policy,
  tenantId: IDS.tenant,
  name: "Nghỉ phép năm",
  code: "ANNUAL",
  type: "annual",
  daysPerYear: 12,
  accrualType: "monthly",
  allowCarryOver: true,
  maxCarryOverDays: 5,
  allowNegativeBalance: false,
  requireApproval: true,
  minAdvanceDays: 3,
  isActive: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

const meta = { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 };

// ---------------------------------------------------------------------------
// User helpers
// ---------------------------------------------------------------------------

const asApprover = (): ICurrentUserPort => ({
  getPermissions: vi.fn().mockReturnValue(["leave.approve", "leave.view.all"]),
  getUserId: vi.fn().mockReturnValue(IDS.manager),
});

const asEmployee = (): ICurrentUserPort => ({
  getPermissions: vi.fn().mockReturnValue(["leave.view.own"]),
  getUserId: vi.fn().mockReturnValue(IDS.employee),
});

const asGuest = (): ICurrentUserPort => ({
  getPermissions: vi.fn().mockReturnValue([]),
  getUserId: vi.fn().mockReturnValue("00000000-0000-0000-0000-000000000001"),
});

// ---------------------------------------------------------------------------

describe("LeaveUseCases", () => {
  let api: ILeavePort;

  beforeEach(() => {
    api = {
      getRequestList: vi.fn().mockResolvedValue({ data: [leaveRequestDto], meta }),
      createRequest: vi.fn().mockResolvedValue(leaveRequestDto),
      getRequestById: vi.fn().mockResolvedValue(leaveRequestDto),
      approveRequest: vi.fn().mockResolvedValue({ ...leaveRequestDto, status: "approved" }),
      rejectRequest: vi.fn().mockResolvedValue({ ...leaveRequestDto, status: "rejected" }),
      cancelRequest: vi.fn().mockResolvedValue({ ...leaveRequestDto, status: "cancelled" }),
      getBalances: vi.fn().mockResolvedValue({ data: [balanceDto], meta }),
      getPolicies: vi.fn().mockResolvedValue({ data: [policyDto], meta }),
    };
  });

  // -------------------------------------------------------------------------
  // getRequestList
  // -------------------------------------------------------------------------

  describe("getRequestList", () => {
    it("forwards filters to API and maps result to domain model", async () => {
      const uc = new LeaveUseCases(api, null);
      const { data } = await uc.getRequestList({
        page: 2,
        pageSize: 10,
        status: "submitted",
        policyCode: "ANNUAL",
      });

      expect(api.getRequestList).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2, pageSize: 10, status: "submitted", policyCode: "ANNUAL" })
      );
      expect(data[0]).toMatchObject({ id: IDS.request, status: "submitted", totalDays: 5 });
    });

    it("strips status=all from API params", async () => {
      const uc = new LeaveUseCases(api, null);
      await uc.getRequestList({ page: 1, pageSize: 20, status: "all" });

      const [params] = vi.mocked(api.getRequestList).mock.calls[0];
      expect(params).not.toHaveProperty("status");
    });

    it("maps approvalChain correctly — optional fields default to null", async () => {
      const dtoWithPartialChain: LeaveRequestDTO = {
        ...leaveRequestDto,
        approvalChain: [{ approverId: undefined, approverName: undefined, decision: undefined }],
      };
      vi.mocked(api.getRequestList).mockResolvedValueOnce({ data: [dtoWithPartialChain], meta });

      const uc = new LeaveUseCases(api, null);
      const { data } = await uc.getRequestList({ page: 1, pageSize: 20 });

      expect(data[0].approvalChain[0]).toMatchObject({
        approverId: null,
        approverName: null,
        decision: null,
      });
    });

    it("throws validation error when pageSize exceeds limit", async () => {
      const uc = new LeaveUseCases(api, null);
      await expect(uc.getRequestList({ page: 1, pageSize: 9999 })).rejects.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // createRequest
  // -------------------------------------------------------------------------

  describe("createRequest", () => {
    const form = {
      policyId: IDS.policy,
      startDate: "2024-07-15",
      endDate: "2024-07-19",
      halfDay: false,
    };

    it("throws ForbiddenError when user has no leave permissions", async () => {
      const uc = new LeaveUseCases(api, asGuest());
      await expect(uc.createRequest(form)).rejects.toThrow(ForbiddenError);
      expect(api.createRequest).not.toHaveBeenCalled();
    });

    it("allows employee with leave.view.own to submit", async () => {
      const uc = new LeaveUseCases(api, asEmployee());
      const result = await uc.createRequest(form);
      expect(result.id).toBe(IDS.request);
      expect(api.createRequest).toHaveBeenCalledOnce();
    });

    it("passes validated fields to API including optional reason", async () => {
      const uc = new LeaveUseCases(api, null);
      await uc.createRequest({ ...form, reason: "Nghỉ gia đình", attachmentUrls: [] });

      expect(api.createRequest).toHaveBeenCalledWith(
        expect.objectContaining({ policyId: IDS.policy, reason: "Nghỉ gia đình" })
      );
    });

    it("throws validation error when policyId is missing", async () => {
      const uc = new LeaveUseCases(api, null);
      await expect(uc.createRequest({ ...form, policyId: "" })).rejects.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // getRequestById
  // -------------------------------------------------------------------------

  describe("getRequestById", () => {
    it("throws NotFoundError when requestId is empty", async () => {
      const uc = new LeaveUseCases(api, null);
      await expect(uc.getRequestById("")).rejects.toThrow(NotFoundError);
      expect(api.getRequestById).not.toHaveBeenCalled();
    });

    it("returns mapped domain model for valid requestId", async () => {
      const uc = new LeaveUseCases(api, null);
      const result = await uc.getRequestById(IDS.request);

      expect(api.getRequestById).toHaveBeenCalledWith(IDS.request);
      expect(result).toMatchObject({ id: IDS.request, employeeName: "Nguyễn Văn A" });
    });
  });

  // -------------------------------------------------------------------------
  // approveRequest
  // -------------------------------------------------------------------------

  describe("approveRequest", () => {
    it("throws ForbiddenError when user lacks leave.approve permission", async () => {
      const uc = new LeaveUseCases(api, asEmployee());
      await expect(uc.approveRequest(IDS.request, {})).rejects.toThrow(ForbiddenError);
      expect(api.approveRequest).not.toHaveBeenCalled();
    });

    it("throws NotFoundError when requestId is empty", async () => {
      const uc = new LeaveUseCases(api, asApprover());
      await expect(uc.approveRequest("", {})).rejects.toThrow(NotFoundError);
    });

    it("throws ForbiddenError when request is not in submitted status", async () => {
      vi.mocked(api.getRequestById).mockResolvedValueOnce({
        ...leaveRequestDto,
        status: "approved",
      });
      const uc = new LeaveUseCases(api, asApprover());
      await expect(uc.approveRequest(IDS.request, {})).rejects.toThrow(ForbiddenError);
      expect(api.approveRequest).not.toHaveBeenCalled();
    });

    it("calls api.approveRequest with comment when request is submitted", async () => {
      const uc = new LeaveUseCases(api, asApprover());
      const result = await uc.approveRequest(IDS.request, { comment: "OK" });

      expect(api.approveRequest).toHaveBeenCalledWith(IDS.request, { comment: "OK" });
      expect(result.status).toBe("approved");
    });
  });

  // -------------------------------------------------------------------------
  // rejectRequest
  // -------------------------------------------------------------------------

  describe("rejectRequest", () => {
    it("throws ForbiddenError when user lacks leave.approve permission", async () => {
      const uc = new LeaveUseCases(api, asEmployee());
      await expect(uc.rejectRequest(IDS.request, {})).rejects.toThrow(ForbiddenError);
    });

    it("throws ForbiddenError when request is not awaiting approval", async () => {
      vi.mocked(api.getRequestById).mockResolvedValueOnce({
        ...leaveRequestDto,
        status: "cancelled",
      });
      const uc = new LeaveUseCases(api, asApprover());
      await expect(uc.rejectRequest(IDS.request, {})).rejects.toThrow(ForbiddenError);
      expect(api.rejectRequest).not.toHaveBeenCalled();
    });

    it("rejects with comment and returns updated domain model", async () => {
      const uc = new LeaveUseCases(api, asApprover());
      const result = await uc.rejectRequest(IDS.request, { comment: "Thiếu nhân sự" });

      expect(api.rejectRequest).toHaveBeenCalledWith(IDS.request, { comment: "Thiếu nhân sự" });
      expect(result.status).toBe("rejected");
    });
  });

  // -------------------------------------------------------------------------
  // cancelRequest
  // -------------------------------------------------------------------------

  describe("cancelRequest", () => {
    it("throws NotFoundError when requestId is empty", async () => {
      const uc = new LeaveUseCases(api, null);
      await expect(uc.cancelRequest("", IDS.employee)).rejects.toThrow(NotFoundError);
    });

    it("throws ForbiddenError when user is not the owner", async () => {
      const uc = new LeaveUseCases(api, null);
      await expect(uc.cancelRequest(IDS.request, "other-user-id")).rejects.toThrow(ForbiddenError);
    });

    it("throws ForbiddenError when request is already approved", async () => {
      vi.mocked(api.getRequestById).mockResolvedValueOnce({
        ...leaveRequestDto,
        status: "approved",
      });
      const uc = new LeaveUseCases(api, null);
      await expect(uc.cancelRequest(IDS.request, IDS.employee)).rejects.toThrow(ForbiddenError);
    });

    it("cancels successfully when owner cancels submitted request", async () => {
      const uc = new LeaveUseCases(api, null);
      const result = await uc.cancelRequest(IDS.request, IDS.employee);

      expect(api.cancelRequest).toHaveBeenCalledWith(IDS.request);
      expect(result.status).toBe("cancelled");
    });

    it("cancels successfully when owner cancels draft request", async () => {
      vi.mocked(api.getRequestById).mockResolvedValueOnce({
        ...leaveRequestDto,
        status: "draft",
      });
      const uc = new LeaveUseCases(api, null);
      await expect(uc.cancelRequest(IDS.request, IDS.employee)).resolves.toBeDefined();
    });
  });

  // -------------------------------------------------------------------------
  // getBalances
  // -------------------------------------------------------------------------

  describe("getBalances", () => {
    it("returns balance list for current employee", async () => {
      const uc = new LeaveUseCases(api, null);
      const result = await uc.getBalances();

      expect(api.getBalances).toHaveBeenCalledWith({ employeeId: undefined });
      expect(result[0]).toMatchObject({ id: IDS.balance, remaining: 3, entitled: 12 });
    });

    it("forwards employeeId to API when provided", async () => {
      const uc = new LeaveUseCases(api, null);
      await uc.getBalances(IDS.employee);
      expect(api.getBalances).toHaveBeenCalledWith({ employeeId: IDS.employee });
    });
  });

  // -------------------------------------------------------------------------
  // getPolicies
  // -------------------------------------------------------------------------

  describe("getPolicies", () => {
    it("returns active policies only", async () => {
      const uc = new LeaveUseCases(api, null);
      const result = await uc.getPolicies();

      expect(api.getPolicies).toHaveBeenCalledWith({ isActive: true });
      expect(result[0]).toMatchObject({ id: IDS.policy, code: "ANNUAL", type: "annual" });
    });

    it("maps maxCarryOverDays to null when absent", async () => {
      const noCarryDto: LeavePolicyDTO = { ...policyDto, maxCarryOverDays: undefined };
      vi.mocked(api.getPolicies).mockResolvedValueOnce({ data: [noCarryDto], meta });

      const uc = new LeaveUseCases(api, null);
      const [pol] = await uc.getPolicies();
      expect(pol.maxCarryOverDays).toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  // Authorization — tổng hợp
  // -------------------------------------------------------------------------

  describe("authorization", () => {
    const form = {
      policyId: IDS.policy,
      startDate: "2024-07-15",
      endDate: "2024-07-19",
      halfDay: false,
    };

    it("null currentUser → skips auth check, all mutations pass through", async () => {
      const uc = new LeaveUseCases(api, null);
      await expect(uc.createRequest(form)).resolves.toBeDefined();
      await expect(uc.approveRequest(IDS.request, {})).resolves.toBeDefined();
    });

    it("guest (no permissions) → create throws ForbiddenError", async () => {
      const uc = new LeaveUseCases(api, asGuest());
      await expect(uc.createRequest(form)).rejects.toThrow(ForbiddenError);
      await expect(uc.approveRequest(IDS.request, {})).rejects.toThrow(ForbiddenError);
      await expect(uc.rejectRequest(IDS.request, {})).rejects.toThrow(ForbiddenError);
    });

    it("employee → can submit but cannot approve or reject", async () => {
      const uc = new LeaveUseCases(api, asEmployee());
      await expect(uc.createRequest(form)).resolves.toBeDefined();
      await expect(uc.approveRequest(IDS.request, {})).rejects.toThrow(ForbiddenError);
      await expect(uc.rejectRequest(IDS.request, {})).rejects.toThrow(ForbiddenError);
    });

    it("approver → can approve and reject, can also submit", async () => {
      const uc = new LeaveUseCases(api, asApprover());
      await expect(uc.createRequest(form)).resolves.toBeDefined();
      await expect(uc.approveRequest(IDS.request, {})).resolves.toBeDefined();
      await expect(uc.rejectRequest(IDS.request, {})).resolves.toBeDefined();
    });
  });
});
