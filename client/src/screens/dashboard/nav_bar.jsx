import React from "react";
import { Grid } from "@mui/material";
import { primaryColor } from "../../constants/colors";
import AppbarMenu from "../../components/app_bar_menu";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useUserContext } from "../../components/contexts/user_context_provider";
import Menu from "./menu";
import { useNavigate } from "react-router-dom";
import { myCalendarRoute, settingsRoute, homeRoute, signinRoute } from "../../constants/routes";

const NavBar = () => {
  const { user } = useUserContext();

  const navigate = useNavigate();
  const accountMenu = [
    // {
    //   id: 1,
    //   title: "Settings",
    //   link: settingsRoute,
    //   icon: <SettingsIcon />,
    //   onClickFunction: () => {},
    // },
    {
      id: 2,
      title: "Logout",
      icon: <LogoutIcon />,
      link: signinRoute,
      onClickFunction: async () => {
        localStorage.removeItem("token");
        navigate(signinRoute);
      },
    },
  ];

  const menuButtons = [
    {
      id: 1,
      text: "Home",
      link: homeRoute,
      icon: <HomeIcon />,
      onClickFunction: () => {
        navigate(homeRoute);
      },
    },
    {
      id: 2,
      text: "My Calendar",
      icon: <CalendarMonthIcon />,
      link: myCalendarRoute,
      onClickFunction: async () => {
        navigate(myCalendarRoute);
      },
    },
  ];

  if (user == null) return <></>;
  return (
    <Grid container style={{ height: "7vh", backgroundColor: primaryColor }}>
      <Grid
        item
        container
        style={{
          height: "7vh",
          alignItems: "center",
          direction: "row",
          justifyContent: "space-between",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        <Grid item>
          <AppbarMenu
            menu={accountMenu}
            shortName={`${user.firstName.toUpperCase()[0]}${user.lastName.toUpperCase()[0]}`}
          />
        </Grid>
        <Grid item>
          <Menu menu={menuButtons} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NavBar;
