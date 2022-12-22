import React from "react";

import { TextField } from "@mui/material";

const MyTextFieldValue = ({ value, fullWidth = true, label, placeholder, type = "text", onChange }) => {
  return (
    <TextField
      style={{ backgroundColor: "#ffffffcc", borderRadius: 12, border: "none" }}
      fullWidth={fullWidth}
      label={label}
      value={value}
      placeholder={placeholder}
      type={type}
      onChange={onChange}
    />
  );
};

export default MyTextFieldValue;
