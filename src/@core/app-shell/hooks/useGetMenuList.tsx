import { useMemo } from "react";
import { Dashboard, Settings } from "@mui/icons-material";
import DashboardUrls from "@modules/dashboard/_routes/path";
import SettingsUrls from "@modules/settings/_routes/path";
import type { MenuItemInterface } from "@shared/types/common.type";

const useGetMenuList = () => {
  const list: MenuItemInterface[] = useMemo(() => {
    return [
      {
        id: 1,
        text: "Dashboard",
        icon: <Dashboard />,
        path: DashboardUrls.ROOT,
      },
      {
        id: 2,
        text: "Settings",
        icon: <Settings />,
        path: SettingsUrls.ROOT,
        children: [
          {
            id: 1,
            text: "Account Setting",
            path: SettingsUrls.ACCOUNT,
          },
          {
            id: 2,
            text: "Color Setting",
            path: SettingsUrls.COLOR,
          },
        ],
      },
    ];
  }, []);

  return list;
};

export default useGetMenuList;
