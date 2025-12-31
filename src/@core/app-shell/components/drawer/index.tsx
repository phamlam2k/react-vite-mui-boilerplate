import useGetMenuList from "@core/app-shell/hooks/useGetMenuList";
import useMediaQuery from "@mui/material/useMediaQuery";
import BaseDrawerDesktop from "./BaseDrawerDesktop";
import BaseDrawerMobile from "./BaseDrawerMobile";
import { memo } from "react";

const BaseDrawer = () => {
  const menuList = useGetMenuList();
  const matches = useMediaQuery(`(min-width: 1024px)`);

  return matches ? (
    <BaseDrawerDesktop listItems={menuList} />
  ) : (
    <BaseDrawerMobile listItems={menuList} />
  );
};

export default memo(BaseDrawer);
