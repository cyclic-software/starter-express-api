import React from "react";
import { Grid, Typography, IconButton, List, ListItem } from "@mui/material";
import { deleteAppointment } from "../../../../controllers/appointments_controller";
import { useUserContext } from "../../../../components/contexts/user_context_provider";
import { useSnackbar } from "notistack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const AppointmentItem = ({ appointment, setReload, setSelectedAppointment, showButtons }) => {
  const { token } = useUserContext();
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteAppointment = async () => {
    // delete appointment
    var response = await deleteAppointment(token, appointment);
    setReload((val) => !val);
    if (response.status === "OK") {
      enqueueSnackbar("Appointment deleted successfully", { variant: "success" });
    } else {
      enqueueSnackbar(response.errorMessage, { variant: "error" });
    }
  };

  const handleEditAppointment = () => {
    setSelectedAppointment(appointment);
  };

  return (
    <Grid
      container
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 5,
        padding: 10,
      }}
    >
      <Grid item container xs={6}>
        <Grid item xs={12}>
          <Typography variant="body1" style={{ fontWeight: "bold" }}>
            {appointment.name}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" style={{ color: "#777777ff", fontWeight: "bold" }}>
            {appointment.phone}
          </Typography>
        </Grid>
      </Grid>
      <Grid item>
        <Typography variant="h5" style={{ fontWeight: "bold" }}>
          {appointment.time}
        </Typography>
      </Grid>
      {showButtons && (
        <Grid item>
          <IconButton color="primary" onClick={handleEditAppointment}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={handleDeleteAppointment}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
};

export default AppointmentItem;
