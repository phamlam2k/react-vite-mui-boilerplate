/**
 * 🟢 USE CASE LAYER - Validations
 * Zod schemas — business invariants từ Domain, pagination từ shared.
 */

import { z } from "zod";
import {
  LEAVE_COMMENT_MAX_LENGTH,
  LEAVE_REASON_MAX_LENGTH,
} from "@modules/leave/_domain/leave.rules";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@shared/constants/paginations";

const leaveStatusSchema = z.enum(["draft", "submitted", "approved", "rejected", "cancelled"]);

export const leaveRequestFiltersSchema = z.object({
  page: z.number().int().positive().default(DEFAULT_PAGE),
  pageSize: z.number().int().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  employeeId: z.string().uuid().optional(),
  status: leaveStatusSchema.or(z.literal("all")).optional().default("all"),
  policyCode: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type LeaveRequestFiltersSchema = z.infer<typeof leaveRequestFiltersSchema>;

export const createLeaveRequestSchema = z.object({
  policyId: z.string().min(1, "Chọn loại nghỉ phép"),
  startDate: z.string().min(1, "Ngày bắt đầu không được để trống"),
  endDate: z.string().min(1, "Ngày kết thúc không được để trống"),
  halfDay: z.boolean().default(false),
  halfDayType: z.enum(["morning", "afternoon"]).nullable().optional(),
  reason: z
    .string()
    .max(LEAVE_REASON_MAX_LENGTH, `Lý do tối đa ${LEAVE_REASON_MAX_LENGTH} ký tự`)
    .nullable()
    .optional(),
  attachmentUrls: z.array(z.string().url()).optional().default([]),
});

export type CreateLeaveRequestSchema = z.infer<typeof createLeaveRequestSchema>;

export const leaveDecisionSchema = z.object({
  comment: z
    .string()
    .max(LEAVE_COMMENT_MAX_LENGTH, `Ghi chú tối đa ${LEAVE_COMMENT_MAX_LENGTH} ký tự`)
    .nullable()
    .optional(),
});

export type LeaveDecisionSchema = z.infer<typeof leaveDecisionSchema>;
