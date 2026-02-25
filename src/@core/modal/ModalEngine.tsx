import { memo } from "react";
import { useModalStore } from "./store/modal.store";

const ModalEngine = () => {
  const { stack, registry } = useModalStore();
  if (!stack.length) return null;

  return (
    <>
      {stack.map((modal, index) => {
        const M = registry[modal.type];
        if (!M || typeof M !== "function") return null;

        if (!M || (typeof M !== "function" && typeof M !== "object"))
          return null;

        const Component = M as React.ComponentType<{
          type: string;
          payload: any;
        }>;

        return (
          <Component key={index} type={modal.type} payload={modal.payload} />
        );
      })}
    </>
  );
};

export default memo(ModalEngine);
