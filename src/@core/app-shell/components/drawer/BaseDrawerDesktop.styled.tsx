import styled from "@emotion/styled";
import { Collapse } from "@mui/material";
import { styled as styledMui } from "@mui/material/styles";

export const drawerWidth = 270;
export const iconWidth = 57;

export const DrawerCollapseStyled = styledMui(Collapse)(() => ({
  maxWidth: drawerWidth,
  height: "100vh",
  overflowY: "auto",
  backgroundColor: "var(--mui-palette-background-paper)",
  boxShadow: "var(--mui-shadows-1)",
  position: "relative",
}));

export const DrawerContentStyled = styled.div<{ isOpenDrawer?: boolean }>`
  width: ${({ isOpenDrawer }) =>
    isOpenDrawer ? `${drawerWidth}px` : `${iconWidth}px`};
  padding: 0px 8px;
`;

export const MenuItemListSideBar = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 10px 8px 10px 8px;
  border-radius: var(--mui-shape-customBorderRadius-lg);
  cursor: pointer;

  .open {
    transform: rotate(180deg);
    transform-origin: center;
    transition: all 0.2s;
  }

  .icon {
    width: 24px;
    height: 24px;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .close {
    transform: rotate(0deg);
    transform-origin: center;
    transition: all 0.2s;
  }

  &.active {
    background-color: var(--mui-palette-primary-lightOpacity);

    svg {
      path {
        color: var(--mui-palette-primary-main);
        stroke: var(--mui-palette-primary-main);
      }

      rect {
        fill: var(--mui-palette-primary-main);
      }
    }

    p {
      color: var(--mui-palette-primary-main);
    }
  }

  &.active-child {
    background-color: transparent;

    svg {
      path {
        color: var(--mui-palette-primary-main);
        stroke: var(--mui-palette-primary-main);
      }

      rect {
        fill: var(--mui-palette-primary-main);
      }
    }

    p {
      color: var(--mui-palette-primary-main);
      font-weight: 700;
    }
  }

  p {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--mui-palette-background-contrastText);
  }

  &:hover {
    background-color: var(--mui-palette-primary-lightOpacity);

    svg {
      path {
        color: var(--mui-palette-primary-main);
        stroke: var(--mui-palette-primary-main);
      }

      rect {
        fill: var(--mui-palette-primary-main);
      }
    }

    p {
      color: var(--mui-palette-primary-main);
    }
  }
`;

export const LogoWrapperStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: start;
  width: 100%;
  margin: auto;
  margin-top: 1rem;
  box-sizing: border-box;
  cursor: pointer;
`;

export const DrawerStyled = styled.div`
  position: relative;
  width: fit-content;
`;

export const DrawerSwitchButtonStyled = styled.div`
  position: absolute;
  background-color: var(--mui-palette-primary-main);
  border: 5px solid var(--mui-palette-background-default);
  width: 30px;
  height: 30px;
  right: -15px;
  top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  z-index: calc(var(--mui-zIndex-appBar) + 1);
`;

export const DrawerCollapseChildrenStyled = styledMui(Collapse)(() => ({
  position: "relative",
  width: "100%",
}));

export const DrawerCollapseChildrenContentStyled = styled.div``;

export const PopupDrawerContentStyled = styled.div`
  padding: 10px;

  .item_popup {
    cursor: pointer;
    color: var(--mui-palette-grey-300);
  }
`;
