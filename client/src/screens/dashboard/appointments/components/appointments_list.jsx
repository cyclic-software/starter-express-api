import React from "react";
import AppointmentItem from "./appointment_item";
import { List, ListItem, Typography } from "@mui/material";

const AppointmentList = ({
  maxHeight = 300,
  appointments,
  setSelectedAppointment,
  setReload,
  showButtons = true,
}) => {
  return (
    <List
      sx={{
        width: "100%",
        overflow: "auto",
        maxHeight: maxHeight,
        borderRadius: 4,
      }}
    >
      {appointments.length === 0 ? (
        <Typography variant="body1" textAlign="center" style={{ fontWeight: "bold" }}>
          No Appointments
        </Typography>
      ) : (
        appointments.map((appointment) => {
          return (
            <ListItem key={appointment._id}>
              <AppointmentItem
                setSelectedAppointment={setSelectedAppointment}
                appointment={appointment}
                setReload={setReload}
                showButtons={showButtons}
              />
            </ListItem>
          );
        })
      )}
    </List>
  );
};

export default AppointmentList;
