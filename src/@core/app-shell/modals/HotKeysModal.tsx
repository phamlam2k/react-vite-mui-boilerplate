import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import Search from "@mui/icons-material/Search";
import BaseModal from "@shared/components/modals/BaseModal";
import CloseIcon from "@mui/icons-material/Close";
import { useHotkeys } from "react-hotkeys-hook";

type HotKeysModalProps = {
  modalProps?: {
    title: string;
  };
};

const HotkeysModal = ({ type }: ModalStack<HotKeysModalProps>) => {
  const { close } = useModalController();

  useHotkeys("esc", () => handleClose());

  const handleClose = () => {
    close(type);
  };

  return (
    <BaseModal open={true} onClose={handleClose} width={600}>
      <div className="px-4 py-4 border-b border-gray-200">
        <InputBase
          autoFocus
          className="w-full"
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
          placeholder="Search pages"
          endAdornment={
            <InputAdornment position="end">
              <div className="flex items-center gap-2">
                <p>[esc]</p>
                <CloseIcon onClick={handleClose} className="cursor-pointer" />
              </div>
            </InputAdornment>
          }
        />
      </div>

      <div className="h-60">{/* TODO: Add logic to search for pages */}</div>
    </BaseModal>
  );
};

export default HotkeysModal;
