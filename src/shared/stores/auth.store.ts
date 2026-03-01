import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface AuthState {
  userId: string | null;
  permissions: string[];
  setAuth: (userId: string, permissions: string[]) => void;
  clearAuth: () => void;
}

const initialState = {
  userId: null as string | null,
  permissions: [] as string[],
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setAuth: (userId, permissions) => set({ userId, permissions }),
        clearAuth: () => set(initialState),
      }),
      { name: "auth-store" }
    )
  )
);

/** Sync auth/me API response into store. Call after login or when getAuthMe succeeds. */
export function syncAuthFromUserProfile(profile: {
  id: string;
  permissions?: Array<{ code: string }>;
}) {
  useAuthStore
    .getState()
    .setAuth(profile.id, profile.permissions?.map(p => p.code) ?? []);
}
