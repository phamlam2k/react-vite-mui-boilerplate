import { Outlet } from "react-router";
import ThemeToggle from "../../../shared/components/ThemeToggle";

const AuthLayout = () => {
  return (
    <>
      <ThemeToggle />
      <Outlet />
    </>
  );
};

export default AuthLayout;
