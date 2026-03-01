import { AuthUseCases } from "@modules/auth/_usecases/auth.usecases";
import { authApiGateway } from "@modules/auth/_api/auth.api";

export const authUseCases = new AuthUseCases(authApiGateway);
