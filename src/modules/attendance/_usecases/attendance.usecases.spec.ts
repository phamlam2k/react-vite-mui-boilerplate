import { describe, it, expect, vi, beforeEach } from "vitest";
import { AttendanceUseCases } from "./attendance.usecases";
import type { IAttendancePort } from "./attendance.port";
import type { ICurrentUserPort } from "@shared/ports/current-user.port";
import { ForbiddenError, NotFoundError } from "@shared/errors/app.errors";
import type {
  AttendanceCorrectionDTO,
  AttendanceRecordDTO,
} from "@modules/attendance/_api/attendance.type";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const IDS = {
  record: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  correction: "b2c3d4e5-f6a7-8901-2345-678901bcdef0",
  tenant: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  employee: "e1a2b3c4-d5e6-7890-abcd-ef1234567890",
  manager: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
};

const recordDto: AttendanceRecordDTO = {
  id: IDS.record,
  tenantId: IDS.tenant,
  employeeId: IDS.employee,
  employeeName: "Nguyễn Văn A",
  date: "2024-06-10",
  checkInAt: "2024-06-10T08:02:00Z",
  checkOutAt: "2024-06-10T17:10:00Z",
  workMode: "office",
  checkInGps: null,
  checkOutGps: null,
  workedMinutes: 548,
  lateMinutes: 2,
  overtimeMinutes: 70,
  status: "late",
  note: null,
  createdAt: "2024-06-10T08:02:00Z",
  updatedAt: "2024-06-10T17:10:00Z",
};

const correctionDto: AttendanceCorrectionDTO = {
  id: IDS.correction,
  tenantId: IDS.tenant,
  employeeId: IDS.employee,
  employeeName: "Nguyễn Văn A",
  attendanceRecordId: IDS.record,
  date: "2024-06-10",
  requestedCheckInAt: "2024-06-10T08:00:00Z",
  requestedCheckOutAt: "2024-06-10T17:00:00Z",
  reason: "Quên check-in vì vội gặp khách",
  status: "pending",
  reviewedBy: null,
  reviewNote: null,
  createdAt: "2024-06-11T09:00:00Z",
  updatedAt: "2024-06-11T09:00:00Z",
};

const meta = { page: 1, pageSize: 20, totalItems: 1, totalPages: 1 };

// ---------------------------------------------------------------------------
// User helpers
// ---------------------------------------------------------------------------

const asManager = (): ICurrentUserPort => ({
  getPermissions: vi.fn().mockReturnValue(["attendance.approve", "attendance.view.all"]),
  getUserId: vi.fn().mockReturnValue(IDS.manager),
});

const asEmployee = (): ICurrentUserPort => ({
  getPermissions: vi.fn().mockReturnValue(["attendance.view.own"]),
  getUserId: vi.fn().mockReturnValue(IDS.employee),
});

const asGuest = (): ICurrentUserPort => ({
  getPermissions: vi.fn().mockReturnValue([]),
  getUserId: vi.fn().mockReturnValue("00000000-0000-0000-0000-000000000001"),
});

// ---------------------------------------------------------------------------

describe("AttendanceUseCases", () => {
  let api: IAttendancePort;

  beforeEach(() => {
    api = {
      checkIn: vi.fn().mockResolvedValue(recordDto),
      checkOut: vi.fn().mockResolvedValue({ ...recordDto, checkOutAt: "2024-06-10T17:30:00Z" }),
      getRecordList: vi.fn().mockResolvedValue({ data: [recordDto], meta }),
      getCorrectionList: vi.fn().mockResolvedValue({ data: [correctionDto], meta }),
      createCorrection: vi.fn().mockResolvedValue(correctionDto),
      approveCorrection: vi.fn().mockResolvedValue({ ...correctionDto, status: "approved" }),
      rejectCorrection: vi.fn().mockResolvedValue({ ...correctionDto, status: "rejected" }),
    };
  });

  // -------------------------------------------------------------------------
  // checkIn
  // -------------------------------------------------------------------------

  describe("checkIn", () => {
    const form = { workMode: "office" as const, note: null };

    it("throws ForbiddenError when user has no attendance permission", async () => {
      const uc = new AttendanceUseCases(api, asGuest());
      await expect(uc.checkIn(form)).rejects.toThrow(ForbiddenError);
      expect(api.checkIn).not.toHaveBeenCalled();
    });

    it("allows employee to check in and returns domain model", async () => {
      const uc = new AttendanceUseCases(api, asEmployee());
      const result = await uc.checkIn(form);

      expect(api.checkIn).toHaveBeenCalledOnce();
      expect(result).toMatchObject({
        id: IDS.record,
        workMode: "office",
        status: "late",
        workedMinutes: 548,
      });
    });

    it("passes work mode and note to API", async () => {
      const uc = new AttendanceUseCases(api, null);
      await uc.checkIn({ workMode: "remote", note: "WFH today" });

      expect(api.checkIn).toHaveBeenCalledWith(
        expect.objectContaining({ workMode: "remote", note: "WFH today" })
      );
    });

    it("throws validation error for invalid work mode", async () => {
      const uc = new AttendanceUseCases(api, null);
      await expect(uc.checkIn({ workMode: "hybrid" as never })).rejects.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // checkOut
  // -------------------------------------------------------------------------

  describe("checkOut", () => {
    it("throws ForbiddenError when user has no attendance permission", async () => {
      const uc = new AttendanceUseCases(api, asGuest());
      await expect(uc.checkOut({})).rejects.toThrow(ForbiddenError);
    });

    it("allows check-out and returns updated domain model", async () => {
      const uc = new AttendanceUseCases(api, asEmployee());
      const result = await uc.checkOut({ note: "Off to client meeting" });

      expect(api.checkOut).toHaveBeenCalledWith(
        expect.objectContaining({ note: "Off to client meeting" })
      );
      expect(result.checkOutAt).toBe("2024-06-10T17:30:00Z");
    });
  });

  // -------------------------------------------------------------------------
  // getRecordList
  // -------------------------------------------------------------------------

  describe("getRecordList", () => {
    const baseFilters = { dateFrom: "2024-06-01", dateTo: "2024-06-30" };

    it("forwards date range and pagination to API", async () => {
      const uc = new AttendanceUseCases(api, null);
      await uc.getRecordList({ ...baseFilters, page: 2, pageSize: 10 });

      expect(api.getRecordList).toHaveBeenCalledWith(
        expect.objectContaining({ dateFrom: "2024-06-01", dateTo: "2024-06-30", page: 2, pageSize: 10 })
      );
    });

    it("strips status=all from API params", async () => {
      const uc = new AttendanceUseCases(api, null);
      await uc.getRecordList({ ...baseFilters, status: "all" });

      const [params] = vi.mocked(api.getRecordList).mock.calls[0];
      expect(params).not.toHaveProperty("status");
    });

    it("maps DTO to domain model — optional fields default to 0/null", async () => {
      const minimalDto: AttendanceRecordDTO = {
        id: IDS.record,
        tenantId: IDS.tenant,
        employeeId: IDS.employee,
        employeeName: "A",
        date: "2024-06-10",
        workMode: "office",
        status: "present",
        createdAt: "2024-06-10T08:00:00Z",
        updatedAt: "2024-06-10T08:00:00Z",
      };
      vi.mocked(api.getRecordList).mockResolvedValueOnce({ data: [minimalDto], meta });

      const uc = new AttendanceUseCases(api, null);
      const { data } = await uc.getRecordList(baseFilters);

      expect(data[0]).toMatchObject({
        checkInAt: null,
        checkOutAt: null,
        workedMinutes: 0,
        lateMinutes: 0,
        overtimeMinutes: 0,
        checkInGps: null,
        checkOutGps: null,
      });
    });

    it("throws validation error when dateFrom is missing", async () => {
      const uc = new AttendanceUseCases(api, null);
      await expect(
        uc.getRecordList({ dateFrom: "", dateTo: "2024-06-30" })
      ).rejects.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // getCorrectionList
  // -------------------------------------------------------------------------

  describe("getCorrectionList", () => {
    it("forwards filters and maps corrections to domain model", async () => {
      const uc = new AttendanceUseCases(api, null);
      const { data } = await uc.getCorrectionList({ page: 1, pageSize: 20, status: "pending" });

      expect(api.getCorrectionList).toHaveBeenCalledWith(
        expect.objectContaining({ status: "pending" })
      );
      expect(data[0]).toMatchObject({
        id: IDS.correction,
        status: "pending",
        reason: "Quên check-in vì vội gặp khách",
      });
    });

    it("strips status=all and empty filters from API params", async () => {
      const uc = new AttendanceUseCases(api, null);
      await uc.getCorrectionList({ status: "all" });

      const [params] = vi.mocked(api.getCorrectionList).mock.calls[0];
      expect(params).not.toHaveProperty("status");
      expect(params).not.toHaveProperty("employeeId");
    });

    it("maps optional fields to null when absent", async () => {
      const dtoNoReview: AttendanceCorrectionDTO = {
        ...correctionDto,
        reviewedBy: undefined,
        reviewNote: undefined,
        requestedCheckOutAt: null,
        attendanceRecordId: null,
      };
      vi.mocked(api.getCorrectionList).mockResolvedValueOnce({ data: [dtoNoReview], meta });

      const uc = new AttendanceUseCases(api, null);
      const { data } = await uc.getCorrectionList({});

      expect(data[0]).toMatchObject({
        reviewedBy: null,
        reviewNote: null,
        requestedCheckOutAt: null,
        attendanceRecordId: null,
      });
    });
  });

  // -------------------------------------------------------------------------
  // createCorrection
  // -------------------------------------------------------------------------

  describe("createCorrection", () => {
    const form = {
      date: "2024-06-10",
      checkInAt: "2024-06-10T08:00:00Z",
      reason: "Quên check-in khi vào cổng công ty",
    };

    it("throws ForbiddenError when guest submits correction", async () => {
      const uc = new AttendanceUseCases(api, asGuest());
      await expect(uc.createCorrection(form)).rejects.toThrow(ForbiddenError);
      expect(api.createCorrection).not.toHaveBeenCalled();
    });

    it("allows employee to submit correction", async () => {
      const uc = new AttendanceUseCases(api, asEmployee());
      const result = await uc.createCorrection(form);

      expect(result.id).toBe(IDS.correction);
      expect(api.createCorrection).toHaveBeenCalledWith(
        expect.objectContaining({ date: "2024-06-10", reason: form.reason })
      );
    });

    it("throws validation error when reason is too short", async () => {
      const uc = new AttendanceUseCases(api, null);
      await expect(uc.createCorrection({ ...form, reason: "Too short" })).rejects.toThrow();
    });

    it("throws validation error when date is empty", async () => {
      const uc = new AttendanceUseCases(api, null);
      await expect(uc.createCorrection({ ...form, date: "" })).rejects.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // approveCorrection
  // -------------------------------------------------------------------------

  describe("approveCorrection", () => {
    it("throws ForbiddenError when employee tries to approve", async () => {
      const uc = new AttendanceUseCases(api, asEmployee());
      await expect(uc.approveCorrection(IDS.correction, {})).rejects.toThrow(ForbiddenError);
      expect(api.approveCorrection).not.toHaveBeenCalled();
    });

    it("throws NotFoundError when correctionId is empty", async () => {
      const uc = new AttendanceUseCases(api, asManager());
      await expect(uc.approveCorrection("", {})).rejects.toThrow(NotFoundError);
    });

    it("approves with optional note and returns updated domain model", async () => {
      const uc = new AttendanceUseCases(api, asManager());
      const result = await uc.approveCorrection(IDS.correction, { note: "Confirmed with CCTV" });

      expect(api.approveCorrection).toHaveBeenCalledWith(IDS.correction, { note: "Confirmed with CCTV" });
      expect(result.status).toBe("approved");
    });

    it("approves without note when note is omitted", async () => {
      const uc = new AttendanceUseCases(api, asManager());
      await uc.approveCorrection(IDS.correction, {});

      expect(api.approveCorrection).toHaveBeenCalledWith(IDS.correction, { note: null });
    });
  });

  // -------------------------------------------------------------------------
  // rejectCorrection
  // -------------------------------------------------------------------------

  describe("rejectCorrection", () => {
    it("throws ForbiddenError when employee tries to reject", async () => {
      const uc = new AttendanceUseCases(api, asEmployee());
      await expect(uc.rejectCorrection(IDS.correction, { reason: "Not valid" })).rejects.toThrow(ForbiddenError);
    });

    it("throws NotFoundError when correctionId is empty", async () => {
      const uc = new AttendanceUseCases(api, asManager());
      await expect(uc.rejectCorrection("", { reason: "x" })).rejects.toThrow(NotFoundError);
    });

    it("throws validation error when reason is empty", async () => {
      const uc = new AttendanceUseCases(api, null);
      await expect(uc.rejectCorrection(IDS.correction, { reason: "" })).rejects.toThrow();
    });

    it("rejects with reason and returns updated domain model", async () => {
      const uc = new AttendanceUseCases(api, asManager());
      const result = await uc.rejectCorrection(IDS.correction, { reason: "No evidence found" });

      expect(api.rejectCorrection).toHaveBeenCalledWith(IDS.correction, { reason: "No evidence found" });
      expect(result.status).toBe("rejected");
    });
  });

  // -------------------------------------------------------------------------
  // Authorization — tổng hợp
  // -------------------------------------------------------------------------

  describe("authorization", () => {
    const checkInForm = { workMode: "office" as const };
    const correctionForm = {
      date: "2024-06-10",
      checkInAt: "2024-06-10T08:00:00Z",
      reason: "Quên check-in khi vào cổng công ty",
    };

    it("null currentUser → skips auth, all operations pass through", async () => {
      const uc = new AttendanceUseCases(api, null);
      await expect(uc.checkIn(checkInForm)).resolves.toBeDefined();
      await expect(uc.checkOut({})).resolves.toBeDefined();
      await expect(uc.createCorrection(correctionForm)).resolves.toBeDefined();
      await expect(uc.approveCorrection(IDS.correction, {})).resolves.toBeDefined();
    });

    it("guest → all write operations throw ForbiddenError", async () => {
      const uc = new AttendanceUseCases(api, asGuest());
      await expect(uc.checkIn(checkInForm)).rejects.toThrow(ForbiddenError);
      await expect(uc.checkOut({})).rejects.toThrow(ForbiddenError);
      await expect(uc.createCorrection(correctionForm)).rejects.toThrow(ForbiddenError);
      await expect(uc.approveCorrection(IDS.correction, {})).rejects.toThrow(ForbiddenError);
    });

    it("employee → can check-in/out and create correction, cannot approve", async () => {
      const uc = new AttendanceUseCases(api, asEmployee());
      await expect(uc.checkIn(checkInForm)).resolves.toBeDefined();
      await expect(uc.checkOut({})).resolves.toBeDefined();
      await expect(uc.createCorrection(correctionForm)).resolves.toBeDefined();
      await expect(uc.approveCorrection(IDS.correction, {})).rejects.toThrow(ForbiddenError);
      await expect(uc.rejectCorrection(IDS.correction, { reason: "x" })).rejects.toThrow(ForbiddenError);
    });

    it("manager → can approve and reject corrections", async () => {
      const uc = new AttendanceUseCases(api, asManager());
      await expect(uc.approveCorrection(IDS.correction, {})).resolves.toBeDefined();
      await expect(uc.rejectCorrection(IDS.correction, { reason: "No evidence" })).resolves.toBeDefined();
    });
  });
});
