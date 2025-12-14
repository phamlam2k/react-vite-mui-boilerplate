import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Outlet } from "react-router";
import { BaseDrawerDesktop, BaseDrawerMobile } from "../components/drawer";
import { Dashboard } from "@mui/icons-material";
import { drawerWidth } from "../components/drawer/BaseDrawerDesktop.styled";
import Header from "../components/header/Header";

const PrivateLayout = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));

  const menuList = [
    {
      id: 1,
      text: "Dashboard",
      icon: <Dashboard />,
      path: "/dashboard",
    },
  ];

  return (
    <div className="w-screen min-h-screen flex">
      {/* Config Drawer for 2 screens */}
      {matches ? (
        <BaseDrawerDesktop listItems={menuList} />
      ) : (
        <BaseDrawerMobile listItems={menuList} />
      )}

      <div
        className="flex flex-1 h-screen flex-col bg-secondary-mainOpacity"
        style={{
          minWidth: `calc(100vw - ${drawerWidth}px)`,
        }}
      >
        <Header />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PrivateLayout;
