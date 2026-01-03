import IconButton from "@mui/material/IconButton";
import ThemeToggle from "@shared/components/ThemeToggle";
import Menu from "@mui/icons-material/Menu";
import { useRegisterModals } from "@core/modal/hooks/useRegisterModals";
import appShellModalRegistry, {
  AppShellModalKeys,
} from "@core/app-shell/modals/app-shell.modal.registry";
import { useModalController } from "@core/modal/hooks/useModalController";
import ModalEngine from "@core/modal/ModalEngine";
import { isDevice } from "@shared/utils/devices";
import { useMemo } from "react";
import Search from "@mui/icons-material/Search";
import { useHotkeys } from "react-hotkeys-hook";

type HeaderProps = {
  isMobile?: boolean;
  handleToggleDrawer?: () => void;
};

const Header = ({ isMobile, handleToggleDrawer }: HeaderProps) => {
  useRegisterModals(appShellModalRegistry);

  const { open } = useModalController();

  const hotKeys = useMemo(() => {
    const isMac = isDevice("MacOS");
    const isWindows = isDevice("Windows");

    if (isMac) {
      return "Search ⌘K";
    }

    if (isWindows) {
      return "Search Ctrl + K";
    }

    return "Search Ctrl + K";
  }, []);

  useHotkeys("ctrl+k,Meta+k", () => handleOpenHotkeysModal());

  const handleOpenHotkeysModal = () => {
    open(AppShellModalKeys.HotkeysModal);
  };

  return (
    <div className="pt-2 sticky top-0 z-10 bg-background-default opacity-95">
      <div className="flex items-center gap-2 h-10 py-6 bg-background-paper w-full justify-between rounded-md px-4">
        <div className="flex items-center gap-2">
          <div>
            {isMobile && (
              <IconButton onClick={handleToggleDrawer}>
                <Menu />
              </IconButton>
            )}
          </div>
          <div
            className="flex items-center gap-2"
            onClick={handleOpenHotkeysModal}
          >
            <Search />
            <p className="text-base text-gray-500">{hotKeys}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle className="relative right-0 top-0" />
        </div>
      </div>
      <ModalEngine />
    </div>
  );
};

export default Header;
