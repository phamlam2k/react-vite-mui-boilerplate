import type { ICurrentUserPort } from "@shared/ports/current-user.port";
import { useAuthStore } from "@shared/stores/auth.store";

/**
 * Adapter: implements ICurrentUserPort by reading from Zustand auth store.
 * Use cases depend on ICurrentUserPort; this is injected at composition root.
 */
export class CurrentUserAdapter implements ICurrentUserPort {
  getPermissions(): string[] {
    return useAuthStore.getState().permissions;
  }

  getUserId(): string | null {
    return useAuthStore.getState().userId;
  }
}

export const currentUserAdapter = new CurrentUserAdapter();
