# Modal Engine

## Description

1, Firstly, create "/<module_name>/modals/\*<module_name>.modal.registry.tsx".

```
import SomethingModal from "./SomethingModal";

export const SomethingModalKeys = {
  SomethingModal: "SomethingModal",
};

const somethingModalRegistry = {
  [SomethingModalKeys.SomethingModal]: SomethingModal,
};
export default somethingModalRegistry;

```

2, In SomethingModals:

```
import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";

export type SomethingModalProps = {
  // Anything example
  onConfirm: () => void
};

const SomethingModal = ({
  type,
  payload,
}: ModalStack<SomethingModalProps>) => {
  const { onConfirm } = payload;

  const { close } = useModalController();

  const handleConfirm = (value: string) => {
    onConfirm(value);
  };

  const handleClose = () => {
    close(type);
  };

  return (
    <Modal open={true} onClose={handleClose}>
        // Modal Content
    </Modal>
  );
};

export default SomethingModal;

```

3, Remember always listen useRegisterModals in main module that you use Modal logic.

Example (MainPage):

```
const MainPage = () => {
    useRegisterModals(somethingModalRegistry)

    return (
        <>
            // Content MainPage
            <ModalEngine />
        </>
    )
}
```
