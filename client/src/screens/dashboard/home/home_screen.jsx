import React, { useEffect, useState } from "react";
import { useUserContext } from "../../../components/contexts/user_context_provider";
import { Grid, Typography, Button } from "@mui/material";
import backgroundImage from "../../../assets/images/background.jpeg";
import { primartColorWithOpacity, primaryColor, secondaryColor } from "../../../constants/colors";
import { myCalendarRoute } from "../../../constants/routes";
import { useNavigate, useLocation } from "react-router-dom";
import { getAppointmentsByDate } from "../../../controllers/appointments_controller";
import AppointmentList from "../appointments/components/appointments_list";

const HomeScreen = () => {
  const { user, token } = useUserContext();
  const navigate = useNavigate();

  const [todayAppointments, setTodayAppointments] = useState([]);

  useEffect(() => {
    const getTodayAppointments = async () => {
      var date = new Date(Date.now());
      var today = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
      var response = await getAppointmentsByDate(token, today);
      if (response.status === "OK") {
        setTodayAppointments(response.data);
      }
    };

    getTodayAppointments();
  }, []);

  if (!user) return <></>;
  return (
    <div
      style={{
        height: "93vh",
        background: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Grid
        container
        direction="row"
        style={{
          height: "93vh",
          padding: 20,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <Grid
          item
          container
          xs={12}
          lg={5.9}
          style={{
            padding: 20,
            borderRadius: 12,
          }}
        >
          <Grid item xs={12}>
            <Typography
              variant="h1"
              color={secondaryColor}
              style={{ fontWeight: "bold" }}
            >{`Welcome back, ${user.firstName} ${user.lastName}`}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3" style={{ color: "white", fontWeight: "bold" }}>
              Here you can manage your appointment diary.
              <br />
              You can add appointments to the calendar and update them.
              <br />
              <br />
              Hope you will enjoy!
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={() => {
                navigate(myCalendarRoute);
              }}
              variant="contained"
              style={{ color: secondaryColor, fontSize: 16, fontWeight: "bold", backgroundColor: "white" }}
            >
              Start Work
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={0.2}></Grid>
        <Grid
          item
          container
          xs={12}
          lg={5.9}
          style={{
            padding: 20,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item xs={12}>
            <Typography variant="h2" style={{ color: "white", fontWeight: "bold" }}>
              Today Appointments
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <AppointmentList appointments={todayAppointments} showButtons={false} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomeScreen;
