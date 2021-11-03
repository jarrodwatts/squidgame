import { Alert, Snackbar } from "@mui/material";
import React, { ReactElement } from "react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function SuccessSnackbar({
  open,
  setOpen,
}: Props): ReactElement {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
        Correct! You answered correctly!
      </Alert>
    </Snackbar>
  );
}
