import React, { useEffect, useState } from "react";
import { Grid, Typography, IconButton, List, ListItem } from "@mui/material";
import { getAppointmentsByDate } from "../../../../controllers/appointments_controller";
import { primaryColor } from "../../../../constants/colors";
import { useUserContext } from "../../../../components/contexts/user_context_provider";
import { useSnackbar } from "notistack";
import AddAppointmentForm from "./forms/add_appointment_form";
import UpdateAppointmentForm from "./forms/update_appointment_form";
import AppointmentList from "./appointments_list";

const SelectedDayAppointments = ({ selectedDay, selectedMonth, selectedYear, reload, setReload }) => {
  const { token } = useUserContext();
  const [appointments, setAppointments] = useState([]);
  const [isAddForm, setIsAddForm] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    setIsAddForm((isAddForm) => false);
  }, [selectedAppointment]);

  useEffect(() => {
    setIsAddForm(true);
    var getAppointmentsInternal = async () => {
      var response = await getAppointmentsByDate(token, `${selectedDay}-${selectedMonth}-${selectedYear}`);
      console.log(JSON.stringify(response));
      if (response.status === "OK") {
        setAppointments(response.data);
      }
    };

    getAppointmentsInternal();

    return () => {};
  }, [selectedDay, selectedMonth, selectedYear, reload]);

  return (
    <Grid
      container
      style={{
        backgroundColor: primaryColor,
        padding: 15,
        borderRadius: 12,
      }}
    >
      <Grid item xs={12}>
        <Typography variant="h5" style={{ fontWeight: "bold", color: "white" }}>
          {`Date: ${selectedDay}.${selectedMonth + 1}.${selectedYear}`}
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ height: "20px" }} />
      <Grid item xs={12}>
        {isAddForm ? (
          <AddAppointmentForm
            setReload={setReload}
            selectedDate={`${selectedDay}-${selectedMonth}-${selectedYear}`}
          />
        ) : (
          <UpdateAppointmentForm
            setIsAddForm={setIsAddForm}
            appointment={selectedAppointment}
            setReload={setReload}
          />
        )}
      </Grid>
      <Grid item xs={12} style={{ height: "20px" }} />
      <Grid item xs={12}>
        <Typography variant="h5" style={{ fontWeight: "bold", color: "white" }}>
          Appointments
        </Typography>
      </Grid>
      <Grid item xs={12} style={{ height: "10px" }} />
      <Grid item container xs={12}>
        <AppointmentList
          appointments={appointments}
          setSelectedAppointment={setSelectedAppointment}
          setReload={setReload}
        />
      </Grid>
    </Grid>
  );
};

export default SelectedDayAppointments;
