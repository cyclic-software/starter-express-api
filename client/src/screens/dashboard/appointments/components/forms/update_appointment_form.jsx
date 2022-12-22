import React, { useEffect, useState } from "react";
import { Grid, Typography, Button, CircularProgress } from "@mui/material";
import { updateAppointment } from "../../../../../controllers/appointments_controller";
import { secondaryColor } from "../../../../../constants/colors";
import { useUserContext } from "../../../../../components/contexts/user_context_provider";
import MyTimePicker from "../../../../../components/my_time_picker";
import { useSnackbar } from "notistack";
import MyTextFieldValue from "../../../../../components/my_text_field_value";

const UpdateAppointmentForm = ({ appointment, setReload, setIsAddForm }) => {
  const { token } = useUserContext();
  const { enqueueSnackbar } = useSnackbar();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (appointment === null) return;

    setName(appointment.name);
    setPhone(appointment.phone);
    setTime(appointment.time);
  }, [appointment]);

  const handleSubmit = async () => {
    // add appointment here
    setSubmitting(true);
    if (name === "" || phone === "" || time === "") {
      enqueueSnackbar("Please fill all fields", { variant: "error" });
      setSubmitting(false);
      return;
    }

    var timeHM = `${time.getHours()}:${time.getMinutes()}`;
    var updatedAppointment = {
      name: name,
      phone: phone,
      time: timeHM,
      date: appointment.date,
      id: appointment._id,
    };

    var response = await updateAppointment(token, updatedAppointment);
    setSubmitting(false);
    setReload((val) => !val);
    if (response.status === "OK") {
      enqueueSnackbar("Appointment updated successfully", { variant: "success" });
    } else {
      enqueueSnackbar(response.errorMessage, { variant: "error" });
    }
  };

  return (
    <Grid container style={{ backgroundColor: "#ffffffcc", borderRadius: 5, padding: 10 }}>
      <Grid item container xs={12} justifyContent="space-between">
        <Grid item>
          <Typography variant="h6" style={{ color: secondaryColor, fontWeight: "bold" }}>
            Edit New Appointment
          </Typography>
        </Grid>
        <Grid item>
          <Button
            onClick={() => setIsAddForm(true)}
            variant="outlined"
            style={{
              color: secondaryColor,
              backgroundColor: "white",
              border: `1px solid ${secondaryColor}`,
              fontWeight: "bold",
            }}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ height: "20px" }} />
      <Grid item xs={12}>
        <MyTextFieldValue
          value={name}
          label="Name"
          placeholder="Type customer name"
          onChange={(e) => setName(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} style={{ height: "20px" }} />
      <Grid item xs={12}>
        <MyTextFieldValue
          value={phone}
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

export default UpdateAppointmentForm;
