import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { useLogout } from "@shared/apis/auth.hook";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

const AvatarPopover = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const { t } = useTranslation("common");
  const { mutate: logout } = useLogout();

  const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={handleOpen}
      >
        <Avatar>
          <PersonIcon />
        </Avatar>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Typography sx={{ p: 2 }}>
          <Button variant="contained" color="primary" onClick={() => logout()}>
            {t("logout")}
          </Button>
        </Typography>
      </Popover>
    </div>
  );
};

export default AvatarPopover;
