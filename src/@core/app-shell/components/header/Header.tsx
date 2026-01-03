import IconButton from "@mui/material/IconButton";
import ThemeToggle from "@shared/components/ThemeToggle";
import Menu from "@mui/icons-material/Menu";
import { useRegisterModals } from "@core/modal/hooks/useRegisterModals";
import appShellModalRegistry, {
  AppShellModalKeys,
} from "@core/app-shell/modals/app-shell.modal.registry";
import { useModalController } from "@core/modal/hooks/useModalController";
import ModalEngine from "@core/modal/ModalEngine";

type HeaderProps = {
  isMobile?: boolean;
  handleToggleDrawer?: () => void;
};

const Header = ({ isMobile, handleToggleDrawer }: HeaderProps) => {
  useRegisterModals(appShellModalRegistry);

  const { open } = useModalController();

  const handleOpenHotkeysModal = () => {
    open(AppShellModalKeys.HotkeysModal);
  };

  return (
    <div className="pt-2 sticky top-0 z-10 bg-background-default opacity-95">
      <div className="flex items-center gap-2 h-10 py-6 bg-background-paper w-full justify-between rounded-md">
        <div>
          <div>
            {isMobile && (
              <IconButton onClick={handleToggleDrawer}>
                <Menu />
              </IconButton>
            )}
          </div>
          <div>
            <div onClick={handleOpenHotkeysModal}>Command + K</div>
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
