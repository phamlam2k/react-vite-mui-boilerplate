import { useMemo } from "react";
import { Dashboard, Settings } from "@mui/icons-material";

const useGetMenuList = () => {
  const list = useMemo(() => {
    return [
      {
        id: 1,
        text: "Dashboard",
        icon: <Dashboard />,
        path: "/dashboard",
      },
      {
        id: 2,
        text: "Settings",
        icon: <Settings />,
        path: "/settings",
        children: [
          {
            id: 1,
            text: "Account Setting",
            path: "/settings/account",
          },
          {
            id: 2,
            text: "Color Setting",
            path: "/settings/color",
          },
        ],
      },
    ];
  }, []);

  return list;
};

export default useGetMenuList;
