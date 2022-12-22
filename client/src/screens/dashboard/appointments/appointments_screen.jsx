import React, { useState } from "react";
import { useUserContext } from "../../../components/contexts/user_context_provider";
import { Grid } from "@mui/material";
import backgroundImage from "../../../assets/images/background.jpeg";
import MyCalendar from "./components/my_calendar";
import SelectedDayAppointments from "./components/selected_day_appointments";

const AppointmentsScreen = () => {
  const { user } = useUserContext();
  const [reload, setReload] = useState(false);

  const [selectedYear, setSelectedYear] = useState(new Date(Date.now()).getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date(Date.now()).getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date(Date.now()).getDate());

  if (!user) return <></>;
  return (
    <>
      <Grid
        container
        direction="row"
        style={{
          height: "93vh",
          padding: 20,
          background: `url(${backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        <Grid item xs={9}>
          <MyCalendar
            reload={reload}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
        </Grid>
        <Grid item xs={12} lg={0.1} />
        <Grid item xs={12} lg={2.9}>
          <SelectedDayAppointments
            selectedDay={selectedDay}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            reload={reload}
            setReload={setReload}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default AppointmentsScreen;
