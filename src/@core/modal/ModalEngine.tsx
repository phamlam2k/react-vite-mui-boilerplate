import { useModalStore } from "./store/modal.store";

export default function ModalEngine() {
  const { stack, registry } = useModalStore();
  if (!stack.length) return null;

  return (
    <>
      {stack.map((modal, index) => {
        const M = registry[modal.type];
        if (!M || typeof M !== "function") return null;

        return M({ key: index, type: modal.type, payload: modal.payload });
      })}
    </>
  );
}
