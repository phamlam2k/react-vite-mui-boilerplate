/**
 * 🟡 ADAPTER - Composition root for permissions
 */

import { permissionsApiGateway } from "@modules/roles_permissions/_api/permissions/permissions.api";
import { PermissionsUseCases } from "@modules/roles_permissions/_usecases/permissions/permissions.usecases";

export const permissionsUseCases = new PermissionsUseCases(permissionsApiGateway);
