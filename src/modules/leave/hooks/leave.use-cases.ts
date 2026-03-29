/**
 * 🟡 ADAPTER LAYER - Composition Root
 * Wires concrete implementations into LeaveUseCases.
 */

import { LeaveUseCases } from "@modules/leave/_usecases/leave.usecases";
import { leaveApiGateway } from "@modules/leave/_api/leave.api";
import { currentUserAdapter } from "@shared/adapters/current-user.adapter";

export const leaveUseCases = new LeaveUseCases(leaveApiGateway, currentUserAdapter);
