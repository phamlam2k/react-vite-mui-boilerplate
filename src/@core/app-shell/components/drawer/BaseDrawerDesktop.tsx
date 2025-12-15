import { useEffect, useRef, useState, type ReactNode } from "react";

import { Popover, Tooltip, Typography } from "@mui/material";

import { useLocation, useNavigate } from "react-router";

import clsx from "clsx";

import {
  DrawerCollapseChildrenContentStyled,
  DrawerCollapseChildrenStyled,
  DrawerCollapseStyled,
  DrawerContentStyled,
  DrawerStyled,
  DrawerSwitchButtonStyled,
  LogoWrapperStyled,
  MenuItemListSideBar,
  PopupDrawerContentStyled,
} from "@core/app-shell/components/drawer/BaseDrawerDesktop.styled";
import { ExpandMore, Menu } from "@mui/icons-material";

const iconWidth = 57;

export type IBaseDrawerDesktopListItem = {
  id: number;
  icon?: ReactNode;
  text: string;
  path?: string;
  children?: IBaseDrawerDesktopListItem[];
};

export type IBaseDrawerDesktopProps = {
  listItems: IBaseDrawerDesktopListItem[];
  switchIcon?: ReactNode;
};

export type IBaseDrawerChildProps = {
  item: IBaseDrawerDesktopListItem;
  isChild?: boolean;
  isOpenDrawer?: boolean;
};

export type IPopupDrawerProps = {
  title: string;
  listItems: IBaseDrawerDesktopListItem[];
  open: boolean;
  anchorEl: HTMLDivElement | null;
  onClose: () => void;
};

const PopupDrawer = ({
  open,
  title,
  anchorEl,
  listItems,
  onClose,
}: IPopupDrawerProps) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "center",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
    >
      <PopupDrawerContentStyled>
        <Typography variant="h5">{title}</Typography>
        {listItems.map((item, index) => (
          <div key={`${item.text}_${index}`} className="item_popup">
            <Typography
              flex={1}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {item.text}
            </Typography>
          </div>
        ))}
      </PopupDrawerContentStyled>
    </Popover>
  );
};

const BaseDrawerChild = ({
  item,
  isChild,
  isOpenDrawer,
}: IBaseDrawerChildProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const [drawerHeight, setDrawerHeight] = useState(0);

  const refDrawer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!item.children) return;

    setDrawerHeight(refDrawer.current?.clientHeight ?? 0);

    if (
      item.children.some(
        (child) => child.path && location.pathname.includes(child.path)
      )
    ) {
      setSelectedItem(item.id);
    }
  }, [location, item]);

  const handleChangeStateCollapse = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (isOpenDrawer) {
      setSelectedItem((prev) => (!!prev ? null : item.id));
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleSwitchRoute = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  if (item.children && item.children.length > 0) {
    return (
      <DrawerCollapseChildrenStyled
        id={id}
        orientation="vertical"
        in={!!selectedItem}
        collapsedSize={drawerHeight}
      >
        <MenuItemListSideBar
          className={clsx({
            active: item.children.some(
              (child) => child.path && location.pathname.includes(child.path)
            ),
          })}
          ref={refDrawer}
          onClick={handleChangeStateCollapse}
        >
          <div className="icon">{item.icon}</div>
          {isOpenDrawer && (
            <>
              <Typography>{item.text}</Typography>
              <div className={`${!!selectedItem ? "open" : "close"}`}>
                <ExpandMore />
              </div>
            </>
          )}
        </MenuItemListSideBar>

        {isOpenDrawer ? (
          <DrawerCollapseChildrenContentStyled>
            {item.children.map((child, index) => (
              <BaseDrawerChild
                key={`${child.text}_${index}`}
                item={child}
                isChild={true}
                isOpenDrawer={isOpenDrawer}
              />
            ))}
          </DrawerCollapseChildrenContentStyled>
        ) : (
          <PopupDrawer
            title={item.text}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            listItems={item.children}
          />
        )}
      </DrawerCollapseChildrenStyled>
    );
  }

  return (
    <Tooltip
      title={item.text}
      placement="right"
      disableHoverListener={isOpenDrawer}
    >
      <MenuItemListSideBar
        className={clsx({
          active:
            !isChild && item.path !== "/"
              ? item.path && location.pathname.includes(item.path)
              : item.path === location.pathname,
          ["active-child"]:
            isChild && location.pathname.includes(item.path ?? ""),
        })}
        onClick={() => handleSwitchRoute(item?.path)}
      >
        <div className="icon">{item.icon}</div>
        {isOpenDrawer && (
          <>
            <Typography>{item.text}</Typography>
          </>
        )}
      </MenuItemListSideBar>
    </Tooltip>
  );
};

const BaseDrawerDesktop = ({
  listItems,
  switchIcon,
}: IBaseDrawerDesktopProps) => {
  const navigate = useNavigate();
  const [isOpenDrawer, setIsOpenDrawer] = useState(true);

  const handleToggleDrawer = () => {
    setIsOpenDrawer((prev) => !prev);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <DrawerStyled className="lg:block hidden">
      <DrawerSwitchButtonStyled onClick={handleToggleDrawer}>
        {switchIcon || (
          <Menu
            width={20}
            height={20}
            sx={{ color: "var(--mui-palette-common-white)" }}
          />
        )}
      </DrawerSwitchButtonStyled>
      <DrawerCollapseStyled
        orientation="horizontal"
        in={isOpenDrawer}
        collapsedSize={iconWidth}
      >
        <LogoWrapperStyled onClick={handleGoHome}>
          <img
            src={"/images/logo.png"}
            alt="Smart CFO Logo"
            style={{
              width: isOpenDrawer ? "fit-content" : 40,
              height: !isOpenDrawer ? "auto" : "fit-content",
              transition: "width 0.2s",
              margin: "0 auto",
              display: "block",
            }}
          />
        </LogoWrapperStyled>

        <div className="h-3" />

        <DrawerContentStyled isOpenDrawer={isOpenDrawer}>
          {listItems.map((item, index) => (
            <BaseDrawerChild
              key={`${item.text}_${item.id}_${index}`}
              isOpenDrawer={isOpenDrawer}
              item={item}
            />
          ))}
        </DrawerContentStyled>
      </DrawerCollapseStyled>
    </DrawerStyled>
  );
};

export default BaseDrawerDesktop;
