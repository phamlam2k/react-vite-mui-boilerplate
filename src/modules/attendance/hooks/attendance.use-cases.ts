/**
 * 🟡 ADAPTER LAYER - Composition Root
 * Wires concrete implementations into AttendanceUseCases.
 */

import { AttendanceUseCases } from "@modules/attendance/_usecases/attendance.usecases";
import { attendanceApiGateway } from "@modules/attendance/_api/attendance.api";
import { currentUserAdapter } from "@shared/adapters/current-user.adapter";

export const attendanceUseCases = new AttendanceUseCases(attendanceApiGateway, currentUserAdapter);
