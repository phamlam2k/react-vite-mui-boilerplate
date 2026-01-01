import { Outlet } from "react-router";
import { drawerWidth } from "../components/drawer/BaseDrawerDesktop.styled";
import Header from "../components/header/Header";
import useGetMenuList from "../hooks/useGetMenuList";
import useMediaQuery from "@mui/material/useMediaQuery";
import { BaseDrawerDesktop, BaseDrawerMobile } from "../components/drawer";
import { useRef } from "react";
import type { BaseDrawerChildRef } from "../components/drawer/BaseDrawerMobile";
import { useTheme } from "@mui/material/styles";

const PrivateLayout = () => {
  const theme = useTheme();
  const drawerMobileRef = useRef<BaseDrawerChildRef>(null);

  const menuList = useGetMenuList();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <div className="w-screen min-h-screen flex">
      {/* Config Drawer for 2 screens */}
      {matches ? (
        <BaseDrawerDesktop listItems={menuList} />
      ) : (
        <BaseDrawerMobile ref={drawerMobileRef} listItems={menuList} />
      )}

      <div
        className="flex flex-1 h-screen flex-col relative px-5  overflow-auto"
        style={{
          minWidth: `calc(100vw - ${drawerWidth}px)`,
        }}
      >
        <Header
          isMobile={!matches}
          handleToggleDrawer={() => drawerMobileRef.current?.toggleDrawer()}
        />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PrivateLayout;
