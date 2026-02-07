import { useModalController } from "@core/modal/hooks/useModalController";
import type { ModalStack } from "@core/modal/store/modal.type";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import Search from "@mui/icons-material/Search";
import BaseModal from "@shared/components/modals/BaseModal";
import CloseIcon from "@mui/icons-material/Close";
import { useHotkeys } from "react-hotkeys-hook";
import useGetMenuList from "../hooks/useGetMenuList";
import { useMemo, useState } from "react";
import { searchMenu } from "@shared/utils/fuse";
import { Link } from "react-router";
import type { MenuItemInterface } from "@shared/types/common.type";

type HotKeysModalProps = {
  modalProps?: {
    title: string;
  };
};

const HotkeysModal = ({ type }: ModalStack<HotKeysModalProps>) => {
  const [searchText, setSearchText] = useState("");
  const { close } = useModalController();
  const menu = useGetMenuList();

  const filteredMenu = useMemo(() => {
    return searchMenu(menu, searchText);
  }, [searchText]);

  function handleClose() {
    close(type);
  }

  useHotkeys("esc", () => handleClose());

  return (
    <BaseModal open={true} onClose={handleClose} width={600}>
      <div className="px-4 py-4 border-b border-gray-200">
        <InputBase
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
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

      <div className="h-60 p-4">
        <div className="grid grid-cols-2 gap-2">
          {filteredMenu.map((item: MenuItemInterface) => (
            <div key={item.id}>
              <div className="flex items-center gap-2">
                <p className="font-medium text-base">{item.text}</p>
              </div>

              {item?.children && (
                <div className="flex flex-col gap-1 mt-2">
                  {item.children.map(child => (
                    <div key={child.id}>
                      <Link to={child.path} onClick={handleClose}>
                        {child.text}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </BaseModal>
  );
};

export default HotkeysModal;
