import React, { useState } from "react";
import { Grid, Typography, Button, CircularProgress } from "@mui/material";
import { secondaryColor } from "../../../../../constants/colors";
import { useUserContext } from "../../../../../components/contexts/user_context_provider";
import MyTextField from "../../../../../components/my_text_field";
import MyTimePicker from "../../../../../components/my_time_picker";
import { useSnackbar } from "notistack";
import { insertAppointment } from "../../../../../controllers/appointments_controller";

const AddAppointmentForm = ({ setReload, selectedDate }) => {
  const { token } = useUserContext();
  const { enqueueSnackbar } = useSnackbar();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    // add appointment here
    setSubmitting(true);
    if (name === "" || phone === "" || time === "") {
      enqueueSnackbar("Please fill all fields", { variant: "error" });
      setSubmitting(false);
      return;
    }

    var timeHM = `${time.getHours()}:${time.getMinutes()}`;
    var appointment = {
      name: name,
      phone: phone,
      time: timeHM,
      date: selectedDate,
    };
    var response = await insertAppointment(token, appointment);
    resetForm();
    setSubmitting(false);
    setReload((val) => !val);
    if (response.status === "OK") {
      enqueueSnackbar("Appointment added successfully", { variant: "success" });
    } else {
      enqueueSnackbar(response.errorMessage, { variant: "error" });
    }
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setTime("");
  };

  return (
    <Grid container style={{ backgroundColor: "#ffffffcc", borderRadius: 5, padding: 10 }}>
      <Grid item xs={12}>
        <Typography variant="h6" style={{ color: secondaryColor, fontWeight: "bold" }}>
          Add New Appointment
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ height: "20px" }} />
      <Grid item xs={12}>
        <MyTextField
          value={name}
          label="Name"
          placeholder="Type customer name"
          onChange={(e) => setName(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} style={{ height: "20px" }} />
      <Grid item xs={12}>
        <MyTextField
          label="Phone"
          placeholder="Type customer phone"
          onChange={(e) => setPhone(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} style={{ height: "20px" }} />
      <Grid item xs={12}>
        <MyTimePicker
          label="Time"
          placeHolder="Choose appointment time"
          value={time}
          setValue={(value) => setTime(value)}
        />
      </Grid>
      <Grid item xs={12} style={{ height: "20px" }} />
      <Grid item xs={12}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            backgroundColor: secondaryColor,
            borderRadius: 12,
            border: "3px solid white",
          }}
        >
          {submitting ? <CircularProgress color="inherit" /> : "Submit"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddAppointmentForm;
