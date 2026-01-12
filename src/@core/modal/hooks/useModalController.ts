import { useModalStore } from "../store/modal.store";

export function useModalController() {
  const open = useModalStore((s) => s.open);
  const close = useModalStore((s) => s.close);

  return {
    open,
    close,
    edit: (type: string, id: string) => open(type, { id }),
    create: (type: string) => open(type),
  };
}
