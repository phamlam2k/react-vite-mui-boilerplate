import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

type BaseModalProps = {
  open: boolean;
  onClose: () => void;
  width?: number;
  children: React.ReactNode;
};

const styles = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
};

const BaseModal = ({
  open,
  onClose,
  width = 600,
  children,
}: BaseModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...styles, width }}>{children}</Box>
    </Modal>
  );
};

export default BaseModal;
