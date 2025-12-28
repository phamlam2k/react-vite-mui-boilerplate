import { darken, lighten, type Theme } from "@mui/material/styles";
import lightColors from "./colors/_light";
import darkColors from "./colors/_dark";

const colorSchemes = (): Theme["colorSchemes"] => {
  const skin = "default" as string;

  return {
    light: {
      palette: {
        ...lightColors,
        divider: `rgb(var(--mui-mainColorChannels-light) / 0.12)`,
        dividerChannel: "var(--mui-mainColorChannels-light)",
        background: {
          default: "#FFFFFF",
          paper: "#F6F6F7",
        },
        action: {
          active: `rgb(var(--mui-mainColorChannels-light) / 0.6)`,
          hover: `rgb(var(--mui-mainColorChannels-light) / 0.04)`,
          selected: `rgb(var(--mui-mainColorChannels-light) / 0.08)`,
          disabled: `#E0E0E0`,
          disabledBackground: `rgb(var(--mui-mainColorChannels-light) / 0.12)`,
          focus: `rgb(var(--mui-mainColorChannels-light) / 0.1)`,
          focusOpacity: 0.1,
          activeChannel: "var(--mui-mainColorChannels-light)",
          selectedChannel: "var(--mui-mainColorChannels-light)",
        },
        Alert: {
          errorColor: "var(--mui-palette-error-main)",
          warningColor: "var(--mui-palette-warning-main)",
          infoColor: "var(--mui-palette-info-main)",
          successColor: "var(--mui-palette-success-main)",
          errorStandardBg: "var(--mui-palette-error-lightOpacity)",
          warningStandardBg: "var(--mui-palette-warning-lightOpacity)",
          infoStandardBg: "var(--mui-palette-info-lightOpacity)",
          successStandardBg: "var(--mui-palette-success-lightOpacity)",
          errorFilledColor: "var(--mui-palette-error-contrastText)",
          warningFilledColor: "var(--mui-palette-warning-contrastText)",
          infoFilledColor: "var(--mui-palette-info-contrastText)",
          successFilledColor: "var(--mui-palette-success-contrastText)",
          errorFilledBg: "var(--mui-palette-error-main)",
          warningFilledBg: "var(--mui-palette-warning-main)",
          infoFilledBg: "var(--mui-palette-info-main)",
          successFilledBg: "var(--mui-palette-success-main)",
        },
        Chip: {
          defaultBorder: "var(--mui-palette-divider)",
        },
        FilledInput: {
          bg: `rgb(var(--mui-mainColorChannels-light) / 0.06)`,
          hoverBg: `rgb(var(--mui-mainColorChannels-light) / 0.08)`,
          disabledBg: `rgb(var(--mui-mainColorChannels-light) / 0.06)`,
        },
        LinearProgress: {
          primaryBg: "var(--mui-palette-primary-mainOpacity)",
          secondaryBg: "var(--mui-palette-secondary-mainOpacity)",
          errorBg: "var(--mui-palette-error-mainOpacity)",
          warningBg: "var(--mui-palette-warning-mainOpacity)",
          infoBg: "var(--mui-palette-info-mainOpacity)",
          successBg: "var(--mui-palette-success-mainOpacity)",
        },
        SnackbarContent: {
          bg: "#1A0E33",
          color: "var(--mui-palette-background-paper)",
        },
        Switch: {
          defaultColor: "var(--mui-palette-common-white)",
          defaultDisabledColor: "var(--mui-palette-common-white)",
          primaryDisabledColor: "var(--mui-palette-common-white)",
          secondaryDisabledColor: "var(--mui-palette-common-white)",
          errorDisabledColor: "var(--mui-palette-common-white)",
          warningDisabledColor: "var(--mui-palette-common-white)",
          infoDisabledColor: "var(--mui-palette-common-white)",
          successDisabledColor: "var(--mui-palette-common-white)",
        },
        Tooltip: {
          bg: "#1A0E33",
        },
        TableCell: {
          border: "var(--mui-palette-divider)",
        },
        customColors: {
          bodyBg: "#F4F5FA",
          chatBg: "#F7F6FA",
          greyLightBg: "#FAFAFA",
          inputBorder: "#D0D5DD",
          tableHeaderBg: "#F6F7FB",
          tooltipText: "#FFFFFF",
          trackBg: "#F0F2F8",
        },
        Button: {
          outline: {
            border: "#B0B0B0",
            contrastText: "#777E90",
          },
        },
        DrawerUI: {
          background: "var(--mui-palette-primary-main)",
          backgroundOpacity: "var(--mui-palette-primary-dark)",
          backgroundHover: "var(--mui-palette-primary-main)",

          textDrawerItem: "var(--mui-palette-text-secondary)",
          textDrawerItemHover: "var(--mui-palette-background-default)",
        },

        // Input component color schemes
        input: {
          border: "#D0D5DD",
          disabledBackground: "#C0C0C061",
          focused: "#8C57FF",
          hover: "#D0D5DD",
          text: "#667085",
          label: "#323544",
          placeholder: "#bfc3cc",
        },
      },
    },
    dark: {
      palette: {
        ...darkColors,
        divider: `rgb(var(--mui-mainColorChannels-dark) / 0.12)`,
        dividerChannel: "var(--mui-mainColorChannels-dark)",
        background: {
          default: skin === "bordered" ? "#312D4B" : "#28243D",
          paper: "#312D4B",
        },
        action: {
          active: `rgb(var(--mui-mainColorChannels-dark) / 0.6)`,
          hover: `rgb(var(--mui-mainColorChannels-dark) / 0.04)`,
          selected: `rgb(var(--mui-mainColorChannels-dark) / 0.08)`,
          disabled: `rgb(var(--mui-mainColorChannels-dark) / 0.3)`,
          disabledBackground: `rgb(var(--mui-mainColorChannels-dark) / 0.12)`,
          focus: `rgb(var(--mui-mainColorChannels-dark) / 0.1)`,
          focusOpacity: 0.1,
          activeChannel: "var(--mui-mainColorChannels-dark)",
          selectedChannel: "var(--mui-mainColorChannels-dark)",
        },
        Alert: {
          errorColor: "var(--mui-palette-error-main)",
          warningColor: "var(--mui-palette-warning-main)",
          infoColor: "var(--mui-palette-info-main)",
          successColor: "var(--mui-palette-success-main)",
          errorStandardBg: "var(--mui-palette-error-lightOpacity)",
          warningStandardBg: "var(--mui-palette-warning-lightOpacity)",
          infoStandardBg: "var(--mui-palette-info-lightOpacity)",
          successStandardBg: "var(--mui-palette-success-lightOpacity)",
          errorFilledColor: "var(--mui-palette-error-contrastText)",
          warningFilledColor: "var(--mui-palette-warning-contrastText)",
          infoFilledColor: "var(--mui-palette-info-contrastText)",
          successFilledColor: "var(--mui-palette-success-contrastText)",
          errorFilledBg: "var(--mui-palette-error-main)",
          warningFilledBg: "var(--mui-palette-warning-main)",
          infoFilledBg: "var(--mui-palette-info-main)",
          successFilledBg: "var(--mui-palette-success-main)",
        },
        Avatar: {
          defaultBg: "#3F3B59",
        },
        Chip: {
          defaultBorder: "var(--mui-palette-divider)",
        },
        FilledInput: {
          bg: `#f2f2f2`,
          hoverBg: `rgb(var(--mui-mainColorChannels-dark) / 0.08)`,
          disabledBg: `rgb(var(--mui-mainColorChannels-dark) / 0.06)`,
          border: "#e5e5e5",
        },
        LinearProgress: {
          primaryBg: "var(--mui-palette-primary-mainOpacity)",
          secondaryBg: "var(--mui-palette-secondary-mainOpacity)",
          errorBg: "var(--mui-palette-error-mainOpacity)",
          warningBg: "var(--mui-palette-warning-mainOpacity)",
          infoBg: "var(--mui-palette-info-mainOpacity)",
          successBg: "var(--mui-palette-success-mainOpacity)",
        },
        SnackbarContent: {
          bg: "#F7F4FF",
          color: "var(--mui-palette-background-paper)",
        },
        Switch: {
          defaultColor: "var(--mui-palette-common-white)",
          defaultDisabledColor: "var(--mui-palette-common-white)",
          primaryDisabledColor: "var(--mui-palette-common-white)",
          secondaryDisabledColor: "var(--mui-palette-common-white)",
          errorDisabledColor: "var(--mui-palette-common-white)",
          warningDisabledColor: "var(--mui-palette-common-white)",
          infoDisabledColor: "var(--mui-palette-common-white)",
          successDisabledColor: "var(--mui-palette-common-white)",
        },
        Tooltip: {
          bg: "#F7F4FF",
        },
        TableCell: {
          border: "var(--mui-palette-divider)",
        },
      },
    },
  } as Theme["colorSchemes"];
};

export default colorSchemes;
