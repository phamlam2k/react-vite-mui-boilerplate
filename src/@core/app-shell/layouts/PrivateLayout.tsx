import { Outlet } from "react-router";
import { drawerWidth } from "../components/drawer/BaseDrawerDesktop.styled";
import Header from "../components/header/Header";
import BaseDrawer from "../components/drawer";

const PrivateLayout = () => {
  return (
    <div className="w-screen min-h-screen flex">
      {/* Config Drawer for 2 screens */}
      <BaseDrawer />

      <div
        className="flex flex-1 h-screen flex-col relative px-5  overflow-auto"
        style={{
          minWidth: `calc(100vw - ${drawerWidth}px)`,
        }}
      >
        <Header />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PrivateLayout;
