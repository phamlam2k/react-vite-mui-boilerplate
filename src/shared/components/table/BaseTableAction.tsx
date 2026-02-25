import type { ReactNode } from "react";
import { useState } from "react";

import {
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

export type ListItemAction = {
  label: string;
  icon?: ReactNode;
  type: string;
};

interface ActionPopoverType<T> {
  data: T;
  listItems: ListItemAction[];
  actions: (type: string, data: T) => void;
}

const BaseTableAction = <TData,>({
  data,
  listItems,
  actions,
}: ActionPopoverType<TData>) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickItem = (type: string) => {
    actions(type, data);
    handleClose();
  };

  return (
    <>
      <button
        className="flex items-center rounded-full border-none bg-backgroundDefault cursor-pointer"
        onClick={handleOpen}
      >
        <span className="text-xl">...</span>
      </button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            boxShadow: 2,
            backgroundColor: "var(--mui-palette-common-white)",
            cursor: "pointer",
          },
        }}
      >
        <List>
          {listItems.map(p => (
            <ListItem key={p.type} onClick={() => handleClickItem(p.type)}>
              {p.icon && <ListItemIcon>{p.icon}</ListItemIcon>}
              <ListItemText primary={p.label} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
};

export default BaseTableAction;
