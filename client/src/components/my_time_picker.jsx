import React from "react";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import heLocale from "date-fns/locale/he";
import { TextField } from "@mui/material";

const MyTimePicker = (props) => {
  const { value, setValue, label } = props;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={heLocale}>
      <TimePicker
        label={label}
        value={value || null}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(params) => <TextField fullWidth {...params} />}
      />
    </LocalizationProvider>
  );
};

export default MyTimePicker;
