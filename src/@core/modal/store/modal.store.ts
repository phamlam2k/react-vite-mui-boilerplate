import { create } from "zustand";
import type { ModalState } from "./modal.type";

export const useModalStore = create<ModalState>()((set) => ({
  registry: {},
  stack: [],

  open: (type: string, payload = null) =>
    set((s: ModalState) => {
      const registry = { ...s.registry };

      if (!registry[type]) {
        return s;
      }

      return { ...s, stack: [...s.stack, { type, payload }] };
    }),

  close: (type: string) =>
    set((s: ModalState) => {
      const registry = { ...s.registry };

      if (registry[type]) {
        return {
          registry,
          stack: [...s.stack].slice(0, -1),
        };
      }

      return s;
    }),

  register: (modals: Record<string, any>) => {
    set((s: ModalState) => {
      const registry = s.registry;
      return { registry: { ...registry, ...modals } };
    });
  },

  unregister: (modals: Record<string, any>) =>
    set((s: ModalState) => {
      const registry = { ...s.registry };
      for (const key of Object.keys(modals)) {
        delete registry[key];
      }
      return { registry };
    }),
}));
