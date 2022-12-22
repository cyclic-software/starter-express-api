import React from "react";

import { TextField } from "@mui/material";

const MyTextField = ({ fullWidth = true, label, placeholder, type = "text", onChange }) => {
  return (
    <TextField
      style={{ backgroundColor: "#ffffffcc", borderRadius: 12, border: "none" }}
      fullWidth={fullWidth}
      label={label}
      placeholder={placeholder}
      type={type}
      onChange={onChange}
    />
  );
};

export default MyTextField;
