import React, { useState, useEffect } from "react";

import { useUserContext } from "../../components/contexts/user_context_provider";
import { getUserInfo } from "../../controllers/user_controller";
import { Grid } from "@mui/material";
import NavBar from "./nav_bar";
import { Routes, Route } from "react-router-dom";
import AppointmentsScreen from "./appointments/appointments_screen";
import HomeScreen from "./home/home_screen";
import { homeRoute, myCalendarRoute } from "../../constants/routes";

const DashboardScreen = () => {
  const { token, user, setUser } = useUserContext();
  const [currentRoute, setCurrentRoute] = useState(homeRoute);
  useEffect(() => {
    if (token == null) return;

    const getUserInfoInternal = async () => {
      var response = await getUserInfo(token);
      if (response.status === "OK") {
        setUser(response.data);
      }
    };

    getUserInfoInternal();

    return () => {};
  }, [token]);

  return (
    <Grid container>
      <Grid xs={12}>
        <NavBar currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} />
      </Grid>
      <Grid xs={12}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path={homeRoute} element={<HomeScreen />} />
          <Route path={myCalendarRoute} element={<AppointmentsScreen />} />
        </Routes>
      </Grid>
    </Grid>
  );
};

export default DashboardScreen;
