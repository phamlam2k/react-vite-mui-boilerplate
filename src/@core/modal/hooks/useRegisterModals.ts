import { useEffect } from "react";
import { useModalStore } from "../store/modal.store";

export function useRegisterModals(registryObj: Record<string, any>) {
  const register = useModalStore((s) => s.register);
  const unregister = useModalStore((s) => s.unregister);

  useEffect(() => {
    register(registryObj);

    return () => {
      unregister(registryObj);
    };
  }, []);
}
