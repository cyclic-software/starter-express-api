import React from "react";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";

const MyDatePicker = ({ disabled, value, setValue, label, size = "small", helperText, error }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        disabled={disabled}
        value={value || null}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(params) => {
          return <TextField size={size} fullWidth {...params} error={error} helperText={helperText} />;
        }}
      />
    </LocalizationProvider>
  );
};

export default MyDatePicker;
