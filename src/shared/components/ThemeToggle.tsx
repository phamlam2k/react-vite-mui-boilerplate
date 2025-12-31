import { useColorScheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { LightMode, DarkMode, SettingsBrightness } from "@mui/icons-material";
import clsx from "clsx";

type Mode = "light" | "dark" | "system";

const ThemeToggle = ({ className }: { className?: string }) => {
  const { mode, setMode } = useColorScheme();

  const currentMode: Mode = (mode as Mode) || "system";

  const handleModeChange = () => {
    const modes: Mode[] = ["light", "dark", "system"];
    const currentIndex = modes.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex]);
  };

  const getIcon = () => {
    switch (currentMode) {
      case "light":
        return <LightMode />;
      case "dark":
        return <DarkMode />;
      case "system":
      default:
        return <SettingsBrightness />;
    }
  };

  const getTooltipTitle = () => {
    switch (currentMode) {
      case "light":
        return "Light mode";
      case "dark":
        return "Dark mode";
      case "system":
      default:
        return "System mode";
    }
  };

  return (
    <div
      className={clsx({
        "fixed top-4 right-4 z-1000": !className,
        className,
      })}
    >
      <Tooltip title={getTooltipTitle()} arrow>
        <IconButton
          onClick={handleModeChange}
          sx={{
            "&:hover": {
              backgroundColor: "var(--mui-palette-action-hover)",
            },
          }}
          aria-label="Toggle theme mode"
        >
          {getIcon()}
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default ThemeToggle;
