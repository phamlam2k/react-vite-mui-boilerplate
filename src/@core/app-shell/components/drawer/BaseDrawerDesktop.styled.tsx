import styled from "@emotion/styled";
import { Collapse } from "@mui/material";
import { styled as styledMui } from "@mui/material/styles";

export const drawerWidth = 270;
export const iconWidth = 57;

export const DrawerCollapseStyled = styledMui(Collapse)(({ theme }) => ({
  maxWidth: drawerWidth,
  height: "100vh",
  overflowY: "auto",
  backgroundColor: theme.palette?.DrawerUI?.background,
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

      path {
        stroke: var(--mui-palette-common-white);
      }
    }
  }

  .close {
    transform: rotate(0deg);
    transform-origin: center;
    transition: all 0.2s;
  }

  &.active {
    background-color: var(--mui-palette-primary-light);

    svg {
      path {
        stroke: var(--mui-palette-common-white);
      }

      rect {
        fill: var(--mui-palette-common-white);
      }
    }

    p {
      color: var(--mui-palette-common-white);
      font-weight: 700;
    }
  }

  &.active-child {
    background-color: transparent;

    svg {
      path {
        stroke: var(--mui-palette-primary-main);
      }

      rect {
        fill: var(--mui-palette-primary-main);
      }
    }

    p {
      color: var(--mui-palette-common-white);
      font-weight: 700;
    }
  }

  p {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--mui-palette-common-white);
  }

  path {
    stroke: var(--mui-palette-common-white);
  }

  &:hover {
    background-color: var(--mui-palette-primary-light);

    svg {
      path {
        stroke: var(--mui-palette-common-white);
      }

      rect {
        fill: var(--mui-palette-common-white);
      }
    }

    p {
      color: var(--mui-palette-common-white);
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
  background-color: var(--mui-palette-primary-light);
  border: 1px solid var(--mui-palette-grey-300);
  width: 30px;
  height: 30px;
  right: -30px;
  top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
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

    &:hover {
      p {
        color: var(--mui-palette-grey-200);
      }
    }
  }
`;
