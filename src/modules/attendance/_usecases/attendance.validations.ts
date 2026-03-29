/**
 * 🟢 USE CASE LAYER - Validations
 * Zod schemas — business invariants từ Domain, pagination từ shared.
 */

import { z } from "zod";
import {
  ATTENDANCE_NOTE_MAX_LENGTH,
  CORRECTION_REASON_MAX_LENGTH,
  CORRECTION_REASON_MIN_LENGTH,
  CORRECTION_REVIEW_NOTE_MAX_LENGTH,
} from "@modules/attendance/_domain/attendance.rules";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@shared/constants/paginations";

const attendanceStatusSchema = z.enum(["present", "absent", "late", "half_day", "corrected"]);
const correctionStatusSchema = z.enum(["pending", "approved", "rejected"]);

export const attendanceRecordFiltersSchema = z.object({
  page: z.number().int().positive().default(DEFAULT_PAGE),
  pageSize: z.number().int().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  employeeId: z.string().optional(),
  orgUnitId: z.string().optional(),
  dateFrom: z.string().min(1, "Từ ngày không được để trống"),
  dateTo: z.string().min(1, "Đến ngày không được để trống"),
  status: attendanceStatusSchema.or(z.literal("all")).optional().default("all"),
});

export type AttendanceRecordFiltersSchema = z.infer<typeof attendanceRecordFiltersSchema>;

export const attendanceCorrectionFiltersSchema = z.object({
  page: z.number().int().positive().default(DEFAULT_PAGE),
  pageSize: z.number().int().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  employeeId: z.string().optional(),
  status: correctionStatusSchema.or(z.literal("all")).optional().default("all"),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type AttendanceCorrectionFiltersSchema = z.infer<typeof attendanceCorrectionFiltersSchema>;

const gpsSchema = z
  .object({ lat: z.number(), lng: z.number() })
  .nullable()
  .optional();

export const checkInSchema = z.object({
  workMode: z.enum(["office", "remote"]),
  gps: gpsSchema,
  deviceInfo: z.string().nullable().optional(),
  note: z
    .string()
    .max(ATTENDANCE_NOTE_MAX_LENGTH, `Ghi chú tối đa ${ATTENDANCE_NOTE_MAX_LENGTH} ký tự`)
    .nullable()
    .optional(),
});

export type CheckInSchema = z.infer<typeof checkInSchema>;

export const checkOutSchema = z.object({
  gps: gpsSchema,
  deviceInfo: z.string().nullable().optional(),
  note: z
    .string()
    .max(ATTENDANCE_NOTE_MAX_LENGTH, `Ghi chú tối đa ${ATTENDANCE_NOTE_MAX_LENGTH} ký tự`)
    .nullable()
    .optional(),
});

export type CheckOutSchema = z.infer<typeof checkOutSchema>;

export const createCorrectionSchema = z.object({
  attendanceRecordId: z.string().nullable().optional(),
  date: z.string().min(1, "Ngày không được để trống"),
  checkInAt: z.string().min(1, "Thời gian check-in không được để trống"),
  checkOutAt: z.string().nullable().optional(),
  reason: z
    .string()
    .min(CORRECTION_REASON_MIN_LENGTH, `Lý do tối thiểu ${CORRECTION_REASON_MIN_LENGTH} ký tự`)
    .max(CORRECTION_REASON_MAX_LENGTH, `Lý do tối đa ${CORRECTION_REASON_MAX_LENGTH} ký tự`),
});

export type CreateCorrectionSchema = z.infer<typeof createCorrectionSchema>;

export const correctionReviewSchema = z.object({
  note: z
    .string()
    .max(CORRECTION_REVIEW_NOTE_MAX_LENGTH, `Ghi chú tối đa ${CORRECTION_REVIEW_NOTE_MAX_LENGTH} ký tự`)
    .nullable()
    .optional(),
});

export type CorrectionReviewSchema = z.infer<typeof correctionReviewSchema>;

export const correctionRejectSchema = z.object({
  reason: z
    .string()
    .min(1, "Lý do từ chối không được để trống")
    .max(CORRECTION_REVIEW_NOTE_MAX_LENGTH, `Lý do tối đa ${CORRECTION_REVIEW_NOTE_MAX_LENGTH} ký tự`),
});

export type CorrectionRejectSchema = z.infer<typeof correctionRejectSchema>;
