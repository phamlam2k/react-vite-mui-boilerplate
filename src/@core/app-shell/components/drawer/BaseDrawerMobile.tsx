import { useState, useRef, useEffect } from "react";

import { Drawer, IconButton, List, styled, Tooltip } from "@mui/material";

import { useLocation, useNavigate } from "react-router";

import clsx from "clsx";

import {
  DrawerCollapseChildrenContentStyled,
  DrawerCollapseChildrenStyled,
  drawerWidth,
  LogoWrapperStyled,
  MenuItemListSideBar,
} from "@core/app-shell/components/drawer/BaseDrawerDesktop.styled";
import type {
  IBaseDrawerChildProps,
  IBaseDrawerDesktopProps,
} from "@core/app-shell/components/drawer/BaseDrawerDesktop";
import { ExpandMore, Menu } from "@mui/icons-material";

const BaseDrawerChild = ({
  item,
  isChild,
  isOpenDrawer,
}: IBaseDrawerChildProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

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
              <p>{item.text}</p>
              <div className={`${!!selectedItem ? "open" : "close"}`}>
                <ExpandMore />
              </div>
            </>
          )}
        </MenuItemListSideBar>
        <DrawerCollapseChildrenContentStyled>
          {item.children.map((child, index) => (
            <BaseDrawerChild
              key={`${child.text}_${index}`}
              isChild={true}
              item={child}
              isOpenDrawer={isOpenDrawer}
            />
          ))}
        </DrawerCollapseChildrenContentStyled>
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
            isChild && item.path && location.pathname.includes(item.path),
        })}
        onClick={() => handleSwitchRoute(item?.path)}
      >
        <div className="icon">{item.icon}</div>
        {isOpenDrawer && (
          <>
            <p>{item.text}</p>
          </>
        )}
      </MenuItemListSideBar>
    </Tooltip>
  );
};

const BaseDrawerMobile = ({
  listItems,
  switchIcon,
}: IBaseDrawerDesktopProps) => {
  const navigate = useNavigate();
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const toggleDrawer = () => {
    setIsOpenDrawer((prev) => !prev);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="max-lg:block hidden relative">
      {!isOpenDrawer && (
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: "absolute",
            top: "15px",
            zIndex: 9998,
          }}
        >
          {switchIcon || <Menu width={20} height={20} />}
        </IconButton>
      )}

      <Drawer anchor="left" open={isOpenDrawer} onClose={toggleDrawer}>
        <div className="px-5 bg-(--mui-palette-primary-main) h-full">
          <LogoWrapperStyled onClick={handleGoHome}>
            <img
              src={"/images/logo.png"}
              alt="Smart CFO Logo"
              style={{
                margin: "0 auto",
                transition: "width 0.2s",
                height: "auto",
              }}
            />
          </LogoWrapperStyled>

          <div className="h-3" />

          <List sx={{ width: drawerWidth }}>
            {listItems.map((item, index) => (
              <BaseDrawerChild
                key={`${item.text}_${item.id}_${index}`}
                isOpenDrawer={isOpenDrawer}
                item={item}
              />
            ))}
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default BaseDrawerMobile;
