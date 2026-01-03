import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import Modal from "@mui/material/Modal";
import Search from "@mui/icons-material/Search";

type HotKeysModalProps = {
  modalProps?: {
    title: string;
  };
};

const HotkeysModal = ({ type, payload }: ModalStack<HotKeysModalProps>) => {
  const { close } = useModalController();

  const handleClose = () => {
    close(type);
  };

  return (
    <Modal open={true} onClose={handleClose}>
      <div>
        <Input
          className="w-full"
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
        />
      </div>
    </Modal>
  );
};

export default HotkeysModal;
