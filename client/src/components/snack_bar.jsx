import React from "react";
import { SnackbarProvider } from "notistack";

const SnackBar = ({ maxSnack, children }) => {
  return (
    <SnackbarProvider maxSnack={maxSnack} anchorOrigin={{ vertical: "center", horizontal: "top" }}>
      {children}
    </SnackbarProvider>
  );
};

export default SnackBar;
