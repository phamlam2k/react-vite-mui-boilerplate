export type ModalState = {
  registry: Record<string, unknown>;
  stack: ModalStack<unknown>[];
  open: (type: string, payload?: unknown) => void;
  close: (type: string) => void;
  register: (modals: Record<string, unknown>) => void;
  unregister: (modals: Record<string, unknown>) => void;
};

export interface ModalStack<TData> {
  type: string;
  payload: TData;
}
