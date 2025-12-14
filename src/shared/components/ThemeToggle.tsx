import { useColorScheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { LightMode, DarkMode, SettingsBrightness } from "@mui/icons-material";

type Mode = "light" | "dark" | "system";

const ThemeToggle = () => {
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
        return "Light mode (Click to switch to Dark)";
      case "dark":
        return "Dark mode (Click to switch to System)";
      case "system":
      default:
        return "System mode (Click to switch to Light)";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-1000">
      <Tooltip title={getTooltipTitle()} arrow>
        <IconButton
          onClick={handleModeChange}
          sx={{
            backgroundColor: "var(--mui-palette-background-paper)",
            boxShadow: "var(--mui-customShadows-sm)",
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
