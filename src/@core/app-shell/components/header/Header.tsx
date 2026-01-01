import IconButton from "@mui/material/IconButton";
import ThemeToggle from "@shared/components/ThemeToggle";
import { Menu } from "@mui/icons-material";

type HeaderProps = {
  isMobile?: boolean;
  handleToggleDrawer?: () => void;
};

const Header = ({ isMobile, handleToggleDrawer }: HeaderProps) => {
  return (
    <div className="pt-2 sticky top-0 z-10 bg-background-default opacity-95">
      <div className="flex items-center gap-2 h-10 py-6 bg-background-paper w-full justify-between rounded-md">
        <div>
          {isMobile && (
            <IconButton onClick={handleToggleDrawer}>
              <Menu />
            </IconButton>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle className="relative right-0 top-0" />
        </div>
      </div>
    </div>
  );
};

export default Header;
