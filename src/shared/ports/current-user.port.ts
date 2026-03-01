/**
 * Port for "current user" / auth context (shared so any module's use cases can depend on it).
 * Adapter (e.g. Zustand store reader) implements it — use cases never import Zustand.
 */

export interface ICurrentUserPort {
  /** Permission codes the current user has (e.g. ["employee:create", "role:delete"]) */
  getPermissions(): string[];
  /** Current user id or null if not logged in */
  getUserId(): string | null;
}
